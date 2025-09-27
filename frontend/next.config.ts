import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    images: {
        domains: ['res.cloudinary.com'],
    },
}

module.exports = nextConfig;
export default nextConfig
