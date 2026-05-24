import { NextResponse, type NextRequest } from 'next/server'

const COOKIE_NAME = 'cb_admin_session'

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const token = request.cookies.get(COOKIE_NAME)?.value
    // ADMIN_AUTH_TOKEN je v .env.local a vo Vercel env vars — pri novom hesle ho stačí
    // zmeniť v env a všetky existujúce admin sessions sa invalidujú.
    const expectedToken = process.env.ADMIN_AUTH_TOKEN
    const isAuthed = !!expectedToken && token === expectedToken

    // Protect /admin/* — cookie token check
    if (pathname.startsWith('/admin')) {
        if (!isAuthed) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        // /admin je teraz Dashboard hub — žiadny redirect
        return NextResponse.next()
    }

    // If already authed and visiting /login → go to dashboard
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
