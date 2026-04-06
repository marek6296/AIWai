import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_PARTNER_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_PARTNER_SUPABASE_ANON_KEY

// Only initialize if we have the credentials, otherwise return null
// This avoids build-time errors when environment variables are not yet configured
export const supabasePartner = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null
