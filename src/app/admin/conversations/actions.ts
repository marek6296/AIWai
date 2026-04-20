'use server'

import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

type Status = 'new' | 'seen' | 'contacted' | 'closed'

export async function updateConversationStatus(id: string, status: Status) {
    const admin = getSupabaseAdmin()
    await admin.from('chatbot_conversations').update({ status }).eq('id', id)
    revalidatePath('/admin/conversations')
    revalidatePath(`/admin/conversations/${id}`)
    revalidatePath('/admin/leads')
}

export async function updateConversationNotes(id: string, notes: string) {
    const admin = getSupabaseAdmin()
    await admin.from('chatbot_conversations').update({ admin_notes: notes }).eq('id', id)
    revalidatePath(`/admin/conversations/${id}`)
}

export async function deleteConversation(id: string) {
    const admin = getSupabaseAdmin()
    await admin.from('chatbot_conversations').delete().eq('id', id)
    revalidatePath('/admin/conversations')
    revalidatePath('/admin/leads')
}
