/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],

    // Compiler optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    reactStrictMode: true,

    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 30,
    },

    compress: true,

    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['framer-motion', 'gsap', 'lucide-react'],
        serverComponentsExternalPackages: ['pdf-parse'],
    },


    webpack: (config) => {
        // Fix for pdf-parse canvas dependency
        config.resolve.alias.canvas = false;
        return config;
    },
};

module.exports = nextConfig;

