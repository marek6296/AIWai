import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

// Lazy-initialized so missing RESEND_API_KEY doesn't crash at build time
let _resend: Resend | null = null
function getResend() {
    if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
    return _resend
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, projectType, message } = body;

        // Save to Supabase
        const { data, error: supabaseError } = await supabase
            .from('contacts')
            .insert([{ name, email, project_type: projectType, message, created_at: new Date().toISOString() }])
            .select();

        if (supabaseError) {
            console.error('Supabase Error:', supabaseError);
        }

        // Send email notification via Resend
        if (process.env.RESEND_API_KEY) {
            await getResend().emails.send({
                from: 'AIWai Formulár <onboarding@resend.dev>',
                to: 'marek@aiwai.app',
                replyTo: `${name} <${email}>`,
                subject: `📩 ${name} — ${projectType}`,
                html: `
                    <h2>Nová správa z webu aiwai.app</h2>
                    <p><strong>Meno:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Typ projektu:</strong> ${projectType}</p>
                    <p><strong>Správa:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p style="color:#999;font-size:12px">Odpovedz priamo na tento email — odpoveď pôjde klientovi.</p>
                `,
            });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process' }, { status: 500 });
    }
}
