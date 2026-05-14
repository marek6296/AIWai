/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
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
        if (process.env.NODE_ENV !== 'production') {
            return [
                {
                    source: '/(.*)',
                    headers: [
                        { key: 'X-Content-Type-Options', value: 'nosniff' },
                        { key: 'X-Frame-Options', value: 'DENY' },
                        { key: 'Cache-Control', value: 'no-store' },
                    ],
                },
            ];
        }
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                ],
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

