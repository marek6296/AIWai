/**
 * Centralizovaný admin auth helper.
 *
 * Používa sa v /api/admin/* routes na overenie, že volajúci je prihlásený admin.
 * Middleware (`src/middleware.ts`) chráni len /admin/* page routes — /api/* je z matchera
 * vylúčené, takže API routes si musia overiť cookie samé.
 *
 * Token je statická hodnota uložená v env (`ADMIN_AUTH_TOKEN`) — porovnávame ho s cookie
 * nastavenou pri prihlásení v `/api/auth/simple-login`.
 */

import { NextRequest, NextResponse } from 'next/server'

export const ADMIN_COOKIE_NAME = 'cb_admin_session'

/** Vráti `null` ak je auth OK, inak `NextResponse` s 401. Volaj na začiatku route handler-a. */
export function requireAdmin(req: Request | NextRequest): NextResponse | null {
    const expected = process.env.ADMIN_AUTH_TOKEN
    if (!expected) {
        // Bezpečnostná poistka — ak admin v env nie je nastavený, nikoho nepustíme.
        console.error('[auth] ADMIN_AUTH_TOKEN is not configured')
        return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    // Cookie môžeme čítať z `NextRequest.cookies` aj z štandardného `Request` cez header.
    const token = ('cookies' in req && typeof (req as NextRequest).cookies?.get === 'function')
        ? (req as NextRequest).cookies.get(ADMIN_COOKIE_NAME)?.value
        : extractCookieFromHeader(req.headers.get('cookie'), ADMIN_COOKIE_NAME)

    if (!token || token !== expected) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return null
}

function extractCookieFromHeader(header: string | null, name: string): string | undefined {
    if (!header) return undefined
    for (const part of header.split(';')) {
        const [k, ...rest] = part.trim().split('=')
        if (k === name) return rest.join('=')
    }
    return undefined
}
