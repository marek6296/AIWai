import { NextResponse } from 'next/server'

const VALID_USERNAME = 'dony'
const VALID_PASSWORD = 'qwert'
const AUTH_TOKEN = 'cb_dony_aiwai_2026_secret'
const COOKIE_NAME = 'cb_admin_session'

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json()

        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            const response = NextResponse.json({ success: true })
            response.cookies.set(COOKIE_NAME, AUTH_TOKEN, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            })
            return response
        }

        return NextResponse.json(
            { error: 'Nesprávne prihlasovacie údaje' },
            { status: 401 }
        )
    } catch {
        return NextResponse.json({ error: 'Chyba servera' }, { status: 500 })
    }
}
