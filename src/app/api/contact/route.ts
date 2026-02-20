import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, projectType, message } = body;

        console.log('Form submission received:', { name, email, projectType, message });

        if (!process.env.RESEND_API_KEY) {
            console.error('Missing RESEND_API_KEY');
            return NextResponse.json({ success: false, error: 'Email service not configured' }, { status: 500 });
        }

        const { data, error } = await resend.emails.send({
            from: 'AIWai Contact <onboarding@resend.dev>',
            to: 'dony.jaij.sk@gmail.com',
            subject: `New Project Inquiry: ${projectType} from ${name}`,
            text: `
                New contact form submission from AIWai:
                
                Name: ${name}
                Email: ${email}
                Project Type: ${projectType}
                Message: ${message}
            `
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process' }, { status: 500 });
    }
}
