'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markFormDone(id: string) {
    const supabase = createClient()
    await supabase
        .from('form_submissions')
        .update({ status: 'done' })
        .eq('id', id)
    revalidatePath('/admin/inbox')
}

export async function markFormNew(id: string) {
    const supabase = createClient()
    await supabase
        .from('form_submissions')
        .update({ status: 'new' })
        .eq('id', id)
    revalidatePath('/admin/inbox')
}
