/** @type {import('next').NextConfig} */

// ─── Content-Security-Policy ───
// Hodnoty domén ktoré stránka legitímne volá:
//   • Supabase (hlavné + partner news project) — fetch & wss
//   • Make.com webhook — kontaktný formulár fire-and-forget
//   • Retell AI — voice agent (web call WebSocket)
//   • Pexels — stock video v portfólio sekcii
//   • Railway webhook — admin client/[email] actions (notifikácie)
//
// 'unsafe-inline' v script-src je potrebné pre JSON-LD <script type="application/ld+json">
//   ktorý Next vkladá inline. Bez nonce/hash sa to inak nedá.
// 'unsafe-inline' v style-src je potrebné pre Tailwind utility classes & framer-motion inline styles.
const CSP_DIRECTIVES = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "media-src 'self' https://videos.pexels.com https://*.supabase.co",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://hook.eu1.make.com https://api.retellai.com wss://api.retellai.com https://primary-production-bc31.up.railway.app",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
].join('; ');

// Permissions-Policy — výslovne povoľujeme len mikrofón pre Retell voice agent.
// Kamera, geolokácia, USB atď. sú zakázané.
const PERMISSIONS_POLICY = [
    'camera=()',
    'geolocation=()',
    'microphone=(self)',
    'payment=()',
    'usb=()',
    'midi=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
    'interest-cohort=()',
].join(', ');

const securityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: PERMISSIONS_POLICY },
    { key: 'Content-Security-Policy', value: CSP_DIRECTIVES },
    // HSTS: 2 roky, includeSubDomains, preload — len v produkcii (v dev by lockol localhost).
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig = {
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // ESLint warnings nebloknú produkčný build (lint sa rieši inde, build sa nezadržiava na unused imports atď.)
    eslint: {
        ignoreDuringBuilds: true,
    },

    reactStrictMode: true,

    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'dmxosdgvmzvkeivknczv.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },

    compress: true,

    experimental: {
        // optimizeCss only in production — in dev it triggers
        //   "TypeError: Cannot read properties of undefined (reading 'call')"
        // inside webpack runtime because critters fights with Next's chunk loader.
        optimizeCss: process.env.NODE_ENV === 'production',
        // Only list packages actually installed — framer-motion/gsap/lenis were removed
        optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
        serverComponentsExternalPackages: ['pdf-parse', 'nodemailer', 'resend'],
    },

    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
    },

    async headers() {
        // In dev, don't send long-cache headers — Chrome keeps webpack chunks
        // for a year (immutable) and then chokes on hash mismatches after edits.
        // V dev tiež nedávame HSTS (lockol by lokálny http) ani strict CSP (preview môže pažať).
        if (process.env.NODE_ENV !== 'production') {
            return [
                {
                    source: '/(.*)',
                    headers: [
                        { key: 'X-Content-Type-Options', value: 'nosniff' },
                        { key: 'X-Frame-Options', value: 'DENY' },
                        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                        { key: 'Cache-Control', value: 'no-store' },
                    ],
                },
            ];
        }
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
            {
                // Static assets — cache 1 year
                source: '/_next/static/(.*)',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                // Public images — cache 7 days
                source: '/:file(.*\\.(?:png|jpg|jpeg|webp|avif|svg))',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
