'use server'

import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

type Table = 'form_submissions' | 'email_submissions'

export async function markDone(id: string, table: Table) {
    const supabase = getSupabaseAdmin()
    await supabase.from(table).update({ status: 'done' }).eq('id', id)
    revalidatePath('/admin/inbox')
}

export async function markNew(id: string, table: Table) {
    const supabase = getSupabaseAdmin()
    await supabase.from(table).update({ status: 'new' }).eq('id', id)
    revalidatePath('/admin/inbox')
}
