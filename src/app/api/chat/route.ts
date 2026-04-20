import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { AIWAI_SYSTEM_PROMPT } from '@/lib/chatbot/knowledge';
import { extractTags, extractLead, buildInterestSummary } from '@/lib/chatbot/analyzer';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

const CONFIG_PATH = path.join(process.cwd(), 'data', 'chatbot-config.json');

const DEFAULT_CONFIG = {
    general: { enabled: true, contactEmail: 'marek@aiwai.app', language: 'auto' },
    model: { model: 'gemini-2.5-flash', temperature: 0.7, maxTokens: 1000 },
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

let _genAI: GoogleGenerativeAI | null = null;
function getGenAI() {
    if (!_genAI) _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    return _genAI;
}

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

/**
 * Convert our OpenAI-style message array to Gemini history format.
 * - system messages are skipped (handled via systemInstruction)
 * - assistant → model
 * - The last user message is NOT included in history; it's sent via sendMessage()
 */
function toGeminiHistory(messages: ChatMessage[]): Content[] {
    const history: Content[] = [];
    // all except the very last message (which we send as the new turn)
    const prev = messages.slice(0, -1);
    for (const m of prev) {
        if (m.role === 'system') continue;
        history.push({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        });
    }
    return history;
}

/**
 * Detekuje jazyk z prvej user správy.
 */
function detectLanguage(text: string): string {
    const lower = text.toLowerCase();
    if (/[ľĺčšťžýáíéóúňďôäöř]/.test(lower)) {
        if (/[řůě]/.test(lower) && !/[ľĺŕ]/.test(lower)) return 'cs';
        return 'sk';
    }
    if (/\b(the|and|you|what|how|price|cost|website|chatbot)\b/.test(lower)) return 'en';
    return 'sk';
}

/**
 * Upsert conversation row + insert all new messages. Non-blocking.
 */
async function persistConversation(opts: {
    sessionId: string;
    messages: ChatMessage[];
    userMessages: string[];
    lastUserMsg: string;
    assistantReply: string;
    language: string;
}): Promise<void> {
    const { sessionId, userMessages, lastUserMsg, assistantReply, language } = opts;

    try {
        const admin = getSupabaseAdmin();

        const tags = extractTags(userMessages);
        const lead = extractLead(userMessages);
        const firstUserMsg = userMessages[0] ?? '';
        const interest = lead.hasAny ? buildInterestSummary(tags, firstUserMsg) : null;

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

        const msgsToInsert: { conversation_id: string; role: 'user' | 'assistant'; content: string }[] = [];
        if (lastUserMsg) msgsToInsert.push({ conversation_id: conversationId, role: 'user', content: lastUserMsg });
        if (assistantReply) msgsToInsert.push({ conversation_id: conversationId, role: 'assistant', content: assistantReply });

        if (msgsToInsert.length > 0) {
            const { error: msgErr } = await admin.from('chatbot_messages').insert(msgsToInsert);
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

        const maxHistory = config.advanced?.maxHistory ?? 12;
        const trimmed = messages.slice(-maxHistory);

        // Last user message is what we send
        const lastUserMsg = trimmed.filter((m) => m.role === 'user').pop();
        if (!lastUserMsg) {
            return NextResponse.json({ message: { role: 'assistant', content: '' } });
        }

        const modelName = config.model?.model || 'gemini-2.5-flash';
        const temperature = config.model?.temperature ?? 0.7;
        const maxOutputTokens = config.model?.maxTokens || 1000;

        const model = getGenAI().getGenerativeModel({
            model: modelName,
            systemInstruction: AIWAI_SYSTEM_PROMPT,
            generationConfig: {
                temperature,
                maxOutputTokens,
            },
        });

        const history = toGeminiHistory(trimmed);
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastUserMsg.content);
        const assistantReply = result.response.text();

        // Fire-and-forget DB persistence
        if (sessionId) {
            const userMessages = trimmed.filter((m) => m.role === 'user').map((m) => m.content);
            const language = detectLanguage(userMessages[0] ?? '');

            persistConversation({
                sessionId,
                messages: trimmed,
                userMessages,
                lastUserMsg: lastUserMsg.content,
                assistantReply,
                language,
            }).catch((e) => console.error('[chat] persist error:', e));
        }

        return NextResponse.json({
            message: { role: 'assistant', content: assistantReply },
        });
    } catch (error) {
        console.error('[chat] error:', error);
        const config = loadConfig();
        const fallback = config.advanced?.fallbackMessage || DEFAULT_CONFIG.advanced.fallbackMessage;
        return NextResponse.json({
            message: { role: 'assistant', content: fallback },
        });
    }
}
