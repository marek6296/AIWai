/**
 * Server-side Supabase klient s SERVICE_ROLE kľúčom.
 *
 * Používaj IBA v server-side kóde (API routes, Server Actions).
 * Obchádza Row Level Security — preto ho NIKDY nepoužívaj
 * v klientskom kóde ani nezdieľaj SUPABASE_SERVICE_ROLE_KEY na frontend.
 *
 * Potrebuje env premennú: SUPABASE_SERVICE_ROLE_KEY
 * (nájdi ju v Supabase Dashboard → Settings → API → service_role key)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
    if (_admin) return _admin;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        throw new Error(
            'Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local'
        );
    }

    _admin = createClient(url, serviceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });

    return _admin;
}
