import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/admin'

const CONFIG_PATH = path.join(process.cwd(), 'data', 'chatbot-config.json')

const DEFAULT_CONFIG = {
    general: {
        name: 'AIWai Assistant',
        welcomeMessage: "Hi! I'm AIWai. How can I help you build something great today?",
        contactEmail: 'marek@aiwai.app',
        language: 'auto',
        personality: 'professional',
        enabled: true,
    },
    model: {
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 500,
        topP: 1.0,
        frequencyPenalty: 0,
        presencePenalty: 0,
    },
    systemPrompt: `You are AIWai, an intelligent digital architect and assistant for the AIWai agency.
The agency specializes in:
- AI Agents (Digital workers handling workflows 24/7)
- AI Chatbots (Conversational interfaces)
- Automation (Business process integration)
- Design & Graphics (UI/UX and branding)

Your tone is professional, futuristic, helpful, and concise.
You should help users understand how AIWai can elevate their business.
If asked about pricing, suggest contacting the team directly via the contact form or email marek@aiwai.app.
Keep responses brief and engaging.
IMPORTANT: Always detect the language of the user's input and respond in exactly that same language.`,
    knowledge: {
        documents: [] as Array<{ id: string; name: string; size: number; uploadedAt: string; charCount: number }>,
        combinedText: '',
    },
    advanced: {
        maxHistory: 10,
        fallbackMessage: "I'm currently recalibrating my neural pathways. Please try again later.",
        prohibitedTopics: '',
        responseFormat: 'plain',
    },
}

// ─── Validation schema pre POST update ───
const updateSchema = z.object({
    general: z.object({
        name: z.string().max(100).optional(),
        welcomeMessage: z.string().max(500).optional(),
        contactEmail: z.string().email().max(200).optional(),
        language: z.enum(['auto', 'sk', 'en', 'cs', 'de']).optional(),
        personality: z.enum(['professional', 'friendly', 'technical', 'sales']).optional(),
        enabled: z.boolean().optional(),
    }).partial().optional(),
    model: z.object({
        model: z.string().max(60).optional(),
        temperature: z.number().min(0).max(2).optional(),
        maxTokens: z.number().int().min(50).max(8000).optional(),
        topP: z.number().min(0).max(1).optional(),
        frequencyPenalty: z.number().min(-2).max(2).optional(),
        presencePenalty: z.number().min(-2).max(2).optional(),
    }).partial().optional(),
    systemPrompt: z.string().max(20000).optional(),
    knowledge: z.object({
        documents: z.array(z.unknown()).optional(),
        combinedText: z.string().max(120000).optional(),
        _docs_with_text: z.array(z.unknown()).optional(),
    }).partial().optional(),
    advanced: z.object({
        maxHistory: z.number().int().min(2).max(50).optional(),
        fallbackMessage: z.string().max(500).optional(),
        prohibitedTopics: z.string().max(2000).optional(),
        responseFormat: z.enum(['plain', 'markdown']).optional(),
    }).partial().optional(),
}).strict()

function readConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true })
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2))
            return DEFAULT_CONFIG
        }
        const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
        const parsed = JSON.parse(raw)
        // Always deep-merge with defaults so missing keys never cause crashes
        return {
            ...DEFAULT_CONFIG,
            ...parsed,
            general:  { ...DEFAULT_CONFIG.general,  ...(parsed.general  || {}) },
            model:    { ...DEFAULT_CONFIG.model,    ...(parsed.model    || {}) },
            knowledge:{ ...DEFAULT_CONFIG.knowledge, ...(parsed.knowledge || {}) },
            advanced: { ...DEFAULT_CONFIG.advanced,  ...(parsed.advanced || {}) },
            systemPrompt: parsed.systemPrompt ?? DEFAULT_CONFIG.systemPrompt,
        }
    } catch {
        return DEFAULT_CONFIG
    }
}

function writeConfig(data: object) {
    fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true })
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2))
}

export async function GET(req: Request) {
    // 🔐 Admin-only endpoint
    const unauthorized = requireAdmin(req)
    if (unauthorized) return unauthorized

    const config = readConfig()
    return NextResponse.json(config)
}

export async function POST(req: Request) {
    // 🔐 Admin-only endpoint
    const unauthorized = requireAdmin(req)
    if (unauthorized) return unauthorized

    try {
        const json = await req.json().catch(() => null)
        const parsed = updateSchema.safeParse(json)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Neplatný formát konfigurácie', issues: parsed.error.flatten() },
                { status: 400 }
            )
        }
        const updates = parsed.data
        const current = readConfig()
        // Deep merge
        const merged = {
            ...current,
            ...updates,
            general: { ...current.general, ...(updates.general || {}) },
            model: { ...current.model, ...(updates.model || {}) },
            knowledge: { ...current.knowledge, ...(updates.knowledge || {}) },
            advanced: { ...current.advanced, ...(updates.advanced || {}) },
        }
        if (updates.systemPrompt !== undefined) merged.systemPrompt = updates.systemPrompt
        writeConfig(merged)
        return NextResponse.json({ success: true, config: merged })
    } catch (err) {
        console.error('[chatbot-settings] error:', err)
        return NextResponse.json({ error: 'Chyba pri ukladaní nastavení' }, { status: 500 })
    }
}
