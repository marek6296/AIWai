import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, projectType, message } = body;

        console.log('Form submission received:', { name, email, projectType, message });

        // 1. Save to Supabase (Database)
        const { data, error: supabaseError } = await supabase
            .from('contacts')
            .insert([
                {
                    name,
                    email,
                    project_type: projectType,
                    message,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (supabaseError) {
            console.error('Supabase Error:', supabaseError);
            // We continue anyway to try and send the email even if DB fails
        }

        // 2. Send email via FormSubmit.co (Free, no API key needed)
        try {
            await fetch('https://formsubmit.co/ajax/dony.jaij.sk@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    project_type: projectType,
                    message: message,
                    _subject: `Nová správa z AIWai od ${name}`
                })
            });
        } catch (mailError) {
            console.error('Mail forwarding error:', mailError);
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process' }, { status: 500 });
    }
}
