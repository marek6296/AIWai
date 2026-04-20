import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { AIWAI_SYSTEM_PROMPT } from '@/lib/chatbot/knowledge';
import { extractTags, extractLead, buildInterestSummary } from '@/lib/chatbot/analyzer';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

const CONFIG_PATH = path.join(process.cwd(), 'data', 'chatbot-config.json');

const DEFAULT_CONFIG = {
    general: { enabled: true, contactEmail: 'marek@aiwai.app', language: 'auto' },
    model: { model: 'gpt-4o', temperature: 0.7, maxTokens: 500, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 },
    advanced: { maxHistory: 12, fallbackMessage: 'Prepáč, teraz mi nejde pripojenie. Napíš priamo na marek@aiwai.app.' },
};

function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const parsed = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
            return { ...DEFAULT_CONFIG, ...parsed };
        }
    } catch { /* ignore */ }
    return DEFAULT_CONFIG;
}

let _openai: OpenAI | null = null;
function getOpenAI() {
    if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return _openai;
}

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

/**
 * Detekuje jazyk z prvej user správy (veľmi hrubý heuristický odhad).
 * Default = 'sk'.
 */
function detectLanguage(text: string): string {
    const lower = text.toLowerCase();
    // Slovak-specific characters
    if (/[ľĺčšťžýáíéóúňďôäöř]/.test(lower)) {
        // CZ has ř, SK rarely; SK has ľĺŕť, CZ rarely
        if (/[řůě]/.test(lower) && !/[ľĺŕ]/.test(lower)) return 'cs';
        return 'sk';
    }
    // English heuristic: common english words
    if (/\b(the|and|you|what|how|price|cost|website|chatbot)\b/.test(lower)) return 'en';
    return 'sk';
}

/**
 * Upsert conversation row + insert all new messages. Non-blocking for the
 * chat response — if DB fails we log it but still respond to the user.
 */
async function persistConversation(opts: {
    sessionId: string;
    messages: ChatMessage[];       // full history including latest assistant reply
    userMessages: string[];
    lastUserMsg: string;
    assistantReply: string;
    language: string;
}): Promise<void> {
    const { sessionId, userMessages, lastUserMsg, assistantReply, language } = opts;

    try {
        const admin = getSupabaseAdmin();

        // Analyze tags + lead data from all user messages so far
        const tags = extractTags(userMessages);
        const lead = extractLead(userMessages);
        const firstUserMsg = userMessages[0] ?? '';
        const interest = lead.hasAny ? buildInterestSummary(tags, firstUserMsg) : null;

        // Upsert conversation
        const { data: existing, error: selectErr } = await admin
            .from('chatbot_conversations')
            .select('id, is_lead')
            .eq('session_id', sessionId)
            .maybeSingle();

        if (selectErr) {
            console.error('[chat] supabase select error:', selectErr);
            return;
        }

        let conversationId: string;

        if (!existing) {
            const { data: inserted, error: insErr } = await admin
                .from('chatbot_conversations')
                .insert({
                    session_id: sessionId,
                    language,
                    tags,
                    is_lead: lead.hasAny,
                    lead_name: lead.name,
                    lead_email: lead.email,
                    lead_phone: lead.phone,
                    lead_interest: interest,
                    lead_captured_at: lead.hasAny ? new Date().toISOString() : null,
                    first_user_msg: firstUserMsg.slice(0, 500),
                    last_user_msg: lastUserMsg.slice(0, 500),
                    status: 'new',
                })
                .select('id')
                .single();

            if (insErr || !inserted) {
                console.error('[chat] supabase insert conversation error:', insErr);
                return;
            }
            conversationId = inserted.id;
        } else {
            conversationId = existing.id;

            // Update existing conversation with latest tags/lead info
            const updates: Record<string, unknown> = {
                tags,
                last_user_msg: lastUserMsg.slice(0, 500),
            };
            if (lead.hasAny && !existing.is_lead) {
                updates.is_lead = true;
                updates.lead_captured_at = new Date().toISOString();
                updates.lead_interest = interest;
            }
            if (lead.email) updates.lead_email = lead.email;
            if (lead.phone) updates.lead_phone = lead.phone;
            if (lead.name) updates.lead_name = lead.name;

            const { error: updErr } = await admin
                .from('chatbot_conversations')
                .update(updates)
                .eq('id', conversationId);
            if (updErr) console.error('[chat] supabase update error:', updErr);
        }

        // Insert the new user message + assistant reply (the two latest)
        const newUserMsg = lastUserMsg;
        const msgsToInsert: { conversation_id: string; role: 'user' | 'assistant'; content: string }[] = [];
        if (newUserMsg) msgsToInsert.push({ conversation_id: conversationId, role: 'user', content: newUserMsg });
        if (assistantReply) msgsToInsert.push({ conversation_id: conversationId, role: 'assistant', content: assistantReply });

        if (msgsToInsert.length > 0) {
            const { error: msgErr } = await admin
                .from('chatbot_messages')
                .insert(msgsToInsert);
            if (msgErr) console.error('[chat] supabase insert messages error:', msgErr);
        }
    } catch (err) {
        console.error('[chat] persistence failed:', err);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const messages: ChatMessage[] = body.messages ?? [];
        const sessionId: string | undefined = body.sessionId;

        const config = loadConfig();

        if (config.general?.enabled === false) {
            return NextResponse.json({
                message: {
                    role: 'assistant',
                    content: 'Chatbot je momentálne vypnutý. Napíš priamo na marek@aiwai.app alebo zavolaj +421 902 876 198.',
                },
            });
        }

        // Trim history
        const maxHistory = config.advanced?.maxHistory ?? 12;
        const trimmed = messages.slice(-maxHistory);

        // Build OpenAI input
        const systemPrompt = { role: 'system' as const, content: AIWAI_SYSTEM_PROMPT };
        const modelConfig = config.model || DEFAULT_CONFIG.model;

        const completion = await getOpenAI().chat.completions.create({
            model: modelConfig.model || 'gpt-4o',
            messages: [systemPrompt, ...trimmed],
            max_tokens: modelConfig.maxTokens || 500,
            temperature: modelConfig.temperature ?? 0.7,
            top_p: modelConfig.topP ?? 1.0,
            frequency_penalty: modelConfig.frequencyPenalty ?? 0,
            presence_penalty: modelConfig.presencePenalty ?? 0,
        });

        const responseMessage = completion.choices[0].message;
        const assistantReply = responseMessage.content || '';

        // Fire-and-forget DB persistence (do not block response)
        if (sessionId) {
            const userMessages = trimmed.filter((m) => m.role === 'user').map((m) => m.content);
            const lastUser = userMessages[userMessages.length - 1] ?? '';
            const language = detectLanguage(userMessages[0] ?? '');

            // Don't await — fire async
            persistConversation({
                sessionId,
                messages: trimmed,
                userMessages,
                lastUserMsg: lastUser,
                assistantReply,
                language,
            }).catch((e) => console.error('[chat] persist error:', e));
        }

        return NextResponse.json({ message: responseMessage });
    } catch (error) {
        console.error('[chat] error:', error);
        const config = loadConfig();
        const fallback = config.advanced?.fallbackMessage || DEFAULT_CONFIG.advanced.fallbackMessage;
        return NextResponse.json({
            message: { role: 'assistant', content: fallback },
        });
    }
}
