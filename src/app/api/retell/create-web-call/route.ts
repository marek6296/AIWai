import { NextResponse } from 'next/server';
import Retell from 'retell-sdk';

export async function POST(req: Request) {
    try {
        if (!process.env.RETELL_API_KEY) {
            return NextResponse.json(
                { error: 'Missing RETELL_API_KEY environment variable' },
                { status: 500 }
            );
        }

        const retell = new Retell({
            apiKey: process.env.RETELL_API_KEY,
        });

        const { agent_id } = await req.json();

        if (!agent_id) {
            return NextResponse.json(
                { error: 'agent_id is required' },
                { status: 400 }
            );
        }

        const webCallResponse = await retell.call.createWebCall({
            agent_id: agent_id,
        });

        return NextResponse.json(webCallResponse);
    } catch (error) {
        console.error('Error creating Retell web call:', error);
        return NextResponse.json(
            { error: 'Failed to create web call' },
            { status: 500 }
        );
    }
}
