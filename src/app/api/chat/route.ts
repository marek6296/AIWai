import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

const CONFIG_PATH = path.join(process.cwd(), 'data', 'chatbot-config.json')

const DEFAULT_CONFIG = {
    general: { enabled: true, contactEmail: 'hello@aiwai.com', language: 'auto' },
    model: { model: 'gpt-4o', temperature: 0.7, maxTokens: 500, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 },
    systemPrompt: `You are AIWai, an intelligent digital architect and assistant for the AIWai agency.
The agency specializes in AI Agents, AI Chatbots, Automation, and Design & Graphics.
Your tone is professional, futuristic, helpful, and concise.
If asked about pricing, suggest contacting hello@aiwai.com.
IMPORTANT: Always respond in the same language as the user's input.`,
    knowledge: { combinedText: '' },
    advanced: { maxHistory: 10, fallbackMessage: "I'm currently recalibrating my neural pathways. Please try again later." },
}

function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
        }
    } catch { /* ignore */ }
    return DEFAULT_CONFIG
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()
        const config = loadConfig()

        if (config.general?.enabled === false) {
            return NextResponse.json({
                message: {
                    role: 'assistant',
                    content: 'Chatbot je momentálne vypnutý. Kontaktujte nás priamo.'
                }
            })
        }

        // Build system prompt with optional knowledge base
        let systemContent = config.systemPrompt || DEFAULT_CONFIG.systemPrompt

        const knowledgeText = config.knowledge?.combinedText || ''
        if (knowledgeText.trim()) {
            systemContent += `\n\n--- KNOWLEDGE BASE ---\n${knowledgeText}\n--- END KNOWLEDGE BASE ---\n\nUse the above knowledge to answer user questions accurately.`
        }

        const systemPrompt = { role: 'system', content: systemContent }

        // Limit conversation history
        const maxHistory = config.advanced?.maxHistory ?? 10
        const trimmedMessages = messages.slice(-maxHistory)

        const modelConfig = config.model || DEFAULT_CONFIG.model

        const completion = await openai.chat.completions.create({
            model: modelConfig.model || 'gpt-4o',
            messages: [systemPrompt, ...trimmedMessages],
            max_tokens: modelConfig.maxTokens || 500,
            temperature: modelConfig.temperature ?? 0.7,
            top_p: modelConfig.topP ?? 1.0,
            frequency_penalty: modelConfig.frequencyPenalty ?? 0,
            presence_penalty: modelConfig.presencePenalty ?? 0,
        })

        const responseMessage = completion.choices[0].message
        return NextResponse.json({ message: responseMessage })
    } catch (error) {
        console.error('Error in chat API:', error)
        const config = loadConfig()
        const fallback = config.advanced?.fallbackMessage || DEFAULT_CONFIG.advanced.fallbackMessage
        return NextResponse.json({
            message: { role: 'assistant', content: fallback }
        })
    }
}
