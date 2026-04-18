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
        optimizeCss: true,
        optimizePackageImports: ['framer-motion', 'gsap', 'lucide-react', 'lenis'],
        serverComponentsExternalPackages: ['pdf-parse'],
    },

    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
    },

    async headers() {
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

