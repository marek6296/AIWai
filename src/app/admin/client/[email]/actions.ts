'use server'

import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

// Legacy stub — kept for backward compatibility with BotToggle/BotQuickToggle
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function toggleBotActive(email: string, active: boolean) {
    void email; void active
    return { success: true, error: null }
}

export async function reviewDraftMessage(formData: FormData) {
    const supabase = getSupabaseAdmin()

    const messageId = formData.get('messageId') as string
    const clientEmail = formData.get('clientEmail') as string
    const content = formData.get('content') as string
    const action = formData.get('action') as string // 'approve' | 'reject'

    if (!messageId || !action || !clientEmail) {
        return { error: 'Missing required fields' }
    }

    if (action === 'reject') {
        const { error } = await supabase
            .from('lead_messages')
            .update({ message_status: 'rejected' })
            .eq('id', messageId)

        if (error) return { error: error.message }

    } else if (action === 'approve') {
        // Save updated content and mark as sent
        const { error } = await supabase
            .from('lead_messages')
            .update({
                content: content,
                message_status: 'sent',
                created_at: new Date().toISOString()
            })
            .eq('id', messageId)

        if (error) return { error: error.message }

        // Update lead status to replied
        await supabase
            .from('leads')
            .update({ status: 'replied' })
            .eq('email', clientEmail)

        // Fetch message record for webhook
        const { data: msgRecord } = await supabase
            .from('lead_messages')
            .select('subject, thread_id, to_email')
            .eq('id', messageId)
            .single()

        // Send via n8n Send Email Webhook
        try {
            await fetch('https://primary-production-bc31.up.railway.app/webhook/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    draft_id: messageId,
                    reply_to_email: msgRecord?.to_email || clientEmail,
                    subject: msgRecord?.subject || 'Re: AIWai',
                    content: content,
                    thread_id: msgRecord?.thread_id || ''
                })
            })
        } catch (e) {
            console.error('Chyba pri odosielani do n8n webhook', e)
        }
    }

    revalidatePath(`/admin/client/${encodeURIComponent(clientEmail)}`)
    revalidatePath('/admin/inbox')
    return { success: true }
}
