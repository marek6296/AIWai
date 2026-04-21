'use server'

import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { invalidatePricingCache } from '@/lib/chatbot/pricing'
import { revalidatePath } from 'next/cache'

export async function updatePrice(id: string, priceFrom: number, priceTo: number | null) {
    const admin = getSupabaseAdmin()
    await admin
        .from('chatbot_pricing')
        .update({ price_from: priceFrom, price_to: priceTo || null })
        .eq('id', id)
    invalidatePricingCache()
    revalidatePath('/admin/pricing')
}

export async function toggleActive(id: string, active: boolean) {
    const admin = getSupabaseAdmin()
    await admin.from('chatbot_pricing').update({ is_active: active }).eq('id', id)
    invalidatePricingCache()
    revalidatePath('/admin/pricing')
}

export async function updateDescription(id: string, description: string) {
    const admin = getSupabaseAdmin()
    await admin.from('chatbot_pricing').update({ description }).eq('id', id)
    invalidatePricingCache()
    revalidatePath('/admin/pricing')
}
