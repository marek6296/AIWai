import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // System prompt to define the persona
        const systemPrompt = {
            role: "system",
            content: `You are AIWai, an intelligent digital architect and assistant for the AIWai agency. 
            The agency specializes in:
            - AI Agents (Digital workers handling workflows 24/7)
            - AI Chatbots (Conversational interfaces)
            - Automation (Business process integration)
            - Design & Graphics (UI/UX and branding)
            
            Your tone is professional, futuristic, helpful, and concise. 
            You should help users understand how AIWai can elevate their business.
            If asked about pricing, suggest contacting the team directly via the contact form or email hello@aiwai.com.
            Keep responses brief and engaging.
            IMPORTANT: Always detect the language of the user's input and respond in exactly that same language. If they speak Slovak, reply in Slovak. If English, reply in English.
            `
        };

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [systemPrompt, ...messages],
            max_tokens: 500,
            temperature: 0.7,
        });

        // Extract the response message
        const responseMessage = completion.choices[0].message;

        return NextResponse.json({ message: responseMessage });
    } catch (error) {
        console.error('Error in chat API:', error);
        return NextResponse.json(
            { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
