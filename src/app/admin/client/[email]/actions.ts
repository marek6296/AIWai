'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleBotActive(email: string, currentStatus: boolean) {
    const supabase = createClient()

    const { error } = await supabase
        .from('clients')
        .update({ bot_active: !currentStatus })
        .eq('email', email)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath(`/admin/client/${encodeURIComponent(email)}`)
    return { success: true }
}

export async function reviewDraftMessage(formData: FormData) {
    const supabase = createClient()

    const messageId = formData.get('messageId') as string
    const clientEmail = formData.get('clientEmail') as string
    const content = formData.get('content') as string
    const action = formData.get('action') as string // 'approve' | 'reject'

    if (!messageId || !action || !clientEmail) {
        return { error: 'Missing required fields' }
    }

    if (action === 'reject') {
        const { error } = await supabase
            .from('email_history')
            .update({ message_status: 'rejected' })
            .eq('id', messageId)

        if (error) return { error: error.message }
    } else if (action === 'approve') {
        // Save the updated content and change status to sent
        const { error } = await supabase
            .from('email_history')
            .update({
                content: content,
                message_status: 'sent',
                created_at: new Date().toISOString() // Refresh timestamps to match "sent" time
            })
            .eq('id', messageId)

        if (error) return { error: error.message }

        // Odoslanie do Make.com webhooku
        try {
            await fetch('https://hook.eu1.make.com/4fhojqtphcxqwehkjjr2tmqjnp67wz01', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientEmail: clientEmail,
                    content: content,
                    subject: 'Re: AIWai'
                })
            });
        } catch (e) {
            console.error("Chyba pri odosielani do Make.com", e);
        }
    }

    revalidatePath(`/admin/client/${encodeURIComponent(clientEmail)}`)
    return { success: true }
}
