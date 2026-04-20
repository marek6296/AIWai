import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, projectType, message } = body;

        // Save to Supabase
        const { data, error: supabaseError } = await supabase
            .from('contacts')
            .insert([{ name, email, phone, project_type: projectType, message, created_at: new Date().toISOString() }])
            .select();

        if (supabaseError) {
            console.error('Supabase Error:', supabaseError);
        }

        // Send email notification via Resend
        if (process.env.RESEND_API_KEY) {
            const { data: emailData, error: resendError } = await resend.emails.send({
                from: 'AIWai Formulár <formular@aiwai.app>',
                to: 'marek@aiwai.app',
                replyTo: `${name} <${email}>`,
                subject: `${name} — ${projectType}`,
                text: `Nová správa z webu aiwai.app\n\nMeno: ${name}\nEmail: ${email}\nTelefón: ${phone || '—'}\nTyp projektu: ${projectType}\nSprávа:\n${message}`,
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
                        <h2 style="color:#111827;margin-top:0;">📩 Nová správa z webu aiwai.app</h2>
                        <table style="width:100%;border-collapse:collapse;">
                            <tr><td style="padding:8px 0;color:#6b7280;width:140px;vertical-align:top;">Meno:</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
                            <tr><td style="padding:8px 0;color:#6b7280;vertical-align:top;">Email:</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#6366f1;">${email}</a></td></tr>
                            <tr><td style="padding:8px 0;color:#6b7280;vertical-align:top;">Telefón:</td><td style="padding:8px 0;">${phone || '—'}</td></tr>
                            <tr><td style="padding:8px 0;color:#6b7280;vertical-align:top;">Typ projektu:</td><td style="padding:8px 0;">${projectType}</td></tr>
                            <tr><td style="padding:8px 0;color:#6b7280;vertical-align:top;">Správа:</td><td style="padding:8px 0;">${message.replace(/\n/g, '<br>')}</td></tr>
                        </table>
                        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
                        <p style="color:#9ca3af;font-size:12px;margin:0;">Odpovedz priamo na tento email — odpoveď pôjde klientovi na <strong>${email}</strong></p>
                    </div>
                `,
            });
            if (resendError) {
                console.error('Resend Error:', JSON.stringify(resendError));
            } else {
                console.log('Resend OK, id:', emailData?.id);
            }
        } else {
            console.warn('RESEND_API_KEY not set — email skipped');
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process' }, { status: 500 });
    }
}
