import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// ─── Input validation ───
const contactSchema = z.object({
    name: z.string().trim().min(1, 'Meno je povinné').max(150),
    email: z.string().trim().email('Neplatný email').max(200),
    phone: z.string().trim().max(40).optional().or(z.literal('')),
    projectType: z.string().trim().min(1).max(120),
    message: z.string().trim().min(1, 'Správa je povinná').max(4000),
});

export async function POST(req: Request) {
    try {
        const rawBody = await req.json().catch(() => null);
        const parsed = contactSchema.safeParse(rawBody);
        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Vyplňte prosím všetky povinné polia správne',
                    issues: parsed.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { name, email, phone, projectType, message } = parsed.data;

        // Uloženie do Supabase — primárny zdroj pravdy pre Inbox.
        // (Email cez Resend bol odstránený — všetky správy idú do admin Inboxu cez Supabase.)
        const { data, error: supabaseError } = await supabase
            .from('form_submissions')
            .insert([{
                name,
                email,
                phone: phone || null,
                project_type: projectType,
                message,
                status: 'new',
                received_at: new Date().toISOString(),
            }])
            .select();

        if (supabaseError) {
            console.error('[contact] Supabase error:', supabaseError);
            return NextResponse.json(
                { success: false, error: 'Správu sa nepodarilo uložiť. Skúste znova alebo napíšte priamo na marek@aiwai.app' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('[contact] error:', error);
        return NextResponse.json(
            { success: false, error: 'Chyba pri spracovaní požiadavky' },
            { status: 500 }
        );
    }
}
