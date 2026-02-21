import type { NextConfig } from 'next'

// /** @type {import('next').NextConfig} **/
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'res.cloudinary.com'
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com'
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '20mb', // puedes subir a 50mb si lo necesitas
        },
    },
}

// module.exports = nextConfig;
export default nextConfig
