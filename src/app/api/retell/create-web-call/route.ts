import { NextResponse } from 'next/server';
import { z } from 'zod';
import Retell from 'retell-sdk';

// Retell agent_id má tvar `agent_<hex>` — striktný regex chráni pred injection do SDK volania.
const requestSchema = z.object({
    agent_id: z.string().regex(/^agent_[a-zA-Z0-9_-]+$/, 'Neplatný agent_id').max(80),
});

export async function POST(req: Request) {
    try {
        if (!process.env.RETELL_API_KEY) {
            console.error('[retell] Missing RETELL_API_KEY');
            return NextResponse.json(
                { error: 'Voice služba nie je nakonfigurovaná' },
                { status: 500 }
            );
        }

        const rawBody = await req.json().catch(() => null);
        const parsed = requestSchema.safeParse(rawBody);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Neplatný agent_id' },
                { status: 400 }
            );
        }

        const retell = new Retell({
            apiKey: process.env.RETELL_API_KEY,
        });

        const webCallResponse = await retell.call.createWebCall({
            agent_id: parsed.data.agent_id,
        });

        return NextResponse.json(webCallResponse);
    } catch (error) {
        console.error('[retell] error creating web call:', error);
        return NextResponse.json(
            { error: 'Nepodarilo sa spustiť hovor' },
            { status: 500 }
        );
    }
}
