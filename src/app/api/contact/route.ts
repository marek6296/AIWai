import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, projectType, message } = body;

        console.log('Form submission received:', { name, email, projectType, message });

        const { data, error } = await supabase
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

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json({ success: false, error: 'Failed to save to database' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process' }, { status: 500 });
    }
}
