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

        // 2. Send email via Web3Forms (More reliable free option)
        try {
            console.log('Attempting to send email via Web3Forms with key 0f1dc3b9...');

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: "0f1dc3b9-37d0-4e0d-aa3e-0601ec0a675d",
                    name: name,
                    email: email,
                    project_type: projectType,
                    message: message,
                    subject: `Nová správa z AIWai od ${name}`,
                    from_name: "AIWai Web",
                    botcheck: false // Optional: help avoid some filters
                })
            });

            const responseText = await response.text();
            console.log('Web3Forms Raw Response:', responseText);

            try {
                const emailResult = JSON.parse(responseText);
                console.log('Web3Forms Parsed Response:', emailResult);
            } catch (pError) {
                console.error('Web3Forms response was not valid JSON. Content starts with:', responseText.substring(0, 100));
            }
        } catch (mailError) {
            console.error('Mail forwarding error:', mailError);
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process' }, { status: 500 });
    }
}
