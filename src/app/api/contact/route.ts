import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 587,
    secure: false,
    auth: {
        user: 'marek@aiwai.app',
        pass: process.env.ZOHO_SMTP_PASSWORD,
    },
});

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

        // Send email notification
        if (process.env.ZOHO_SMTP_PASSWORD) {
            await transporter.sendMail({
                from: '"AIWai Web" <marek@aiwai.app>',
                to: 'marek@aiwai.app',
                subject: `Nová správa od ${name} — ${projectType}`,
                html: `
                    <h2>Nová správa z webu aiwai.app</h2>
                    <p><strong>Meno:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Typ projektu:</strong> ${projectType}</p>
                    <p><strong>Správa:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                `,
            });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process' }, { status: 500 });
    }
}
