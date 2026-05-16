import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { ADMIN_COOKIE_NAME } from '@/lib/auth/admin'

const loginSchema = z.object({
    username: z.string().min(1).max(64),
    password: z.string().min(1).max(200),
})

export async function POST(req: Request) {
    try {
        const json = await req.json().catch(() => null)
        const parsed = loginSchema.safeParse(json)
        if (!parsed.success) {
            return NextResponse.json({ error: 'Neplatný formát požiadavky' }, { status: 400 })
        }
        const { username, password } = parsed.data

        const expectedUsername = process.env.ADMIN_USERNAME
        const expectedHash = process.env.ADMIN_PASSWORD_HASH
        const authToken = process.env.ADMIN_AUTH_TOKEN

        if (!expectedUsername || !expectedHash || !authToken) {
            console.error('[login] Missing ADMIN_* env vars')
            return NextResponse.json({ error: 'Server nie je nakonfigurovaný' }, { status: 500 })
        }

        // Vždy spustíme bcrypt aj pri zlom username — eliminuje timing attack na username enumeration.
        const usernameOk = username === expectedUsername
        const passwordOk = await bcrypt.compare(password, expectedHash)

        if (!usernameOk || !passwordOk) {
            return NextResponse.json(
                { error: 'Nesprávne prihlasovacie údaje' },
                { status: 401 }
            )
        }

        const response = NextResponse.json({ success: true })
        response.cookies.set(ADMIN_COOKIE_NAME, authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 dní
            path: '/',
        })
        return response
    } catch (err) {
        console.error('[login] error:', err)
        return NextResponse.json({ error: 'Chyba servera' }, { status: 500 })
    }
}
