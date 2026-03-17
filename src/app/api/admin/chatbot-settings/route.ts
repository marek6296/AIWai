import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const CONFIG_PATH = path.join(process.cwd(), 'data', 'chatbot-config.json')

const DEFAULT_CONFIG = {
    general: {
        name: 'AIWai Assistant',
        welcomeMessage: "Hi! I'm AIWai. How can I help you build something great today?",
        contactEmail: 'hello@aiwai.com',
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
If asked about pricing, suggest contacting the team directly via the contact form or email hello@aiwai.com.
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

function readConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true })
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2))
            return DEFAULT_CONFIG
        }
        const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
        return JSON.parse(raw)
    } catch {
        return DEFAULT_CONFIG
    }
}

function writeConfig(data: object) {
    fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true })
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2))
}

export async function GET() {
    const config = readConfig()
    return NextResponse.json(config)
}

export async function POST(req: Request) {
    try {
        const updates = await req.json()
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
        return NextResponse.json({ error: String(err) }, { status: 500 })
    }
}
