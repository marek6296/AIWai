import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, projectType, message } = body;

        console.log('Form submission received:', { name, email, projectType, message });

        // In a real production environment, you would use a service like Resend, SendGrid, or Nodemailer here.
        // For example with Resend:
        /*
        await resend.emails.send({
            from: 'AIWai Contact <onboarding@resend.dev>',
            to: 'dony.jaij.sk@gmail.com',
            subject: `New Project Inquiry: ${projectType} from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Project Type: ${projectType}
                Message: ${message}
            `
        });
        */

        // For now, we simulate success
        return NextResponse.json({ success: true, message: 'Email received' });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process' }, { status: 500 });
    }
}
