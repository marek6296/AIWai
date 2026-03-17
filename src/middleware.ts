import { NextResponse, type NextRequest } from 'next/server'

const AUTH_TOKEN = 'cb_dony_aiwai_2026_secret'
const COOKIE_NAME = 'cb_admin_session'

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const token = request.cookies.get(COOKIE_NAME)?.value
    const isAuthed = token === AUTH_TOKEN

    // Protect /admin/* — simple cookie only
    if (pathname.startsWith('/admin')) {
        if (!isAuthed) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        return NextResponse.next()
    }

    // If already authed and visiting /login → go to /admin
    if (pathname === '/login' && isAuthed) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
