import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_PARTNER_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_PARTNER_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Partner Supabase credentials missing.')
}

export const supabasePartner = createClient(supabaseUrl, supabaseAnonKey)
