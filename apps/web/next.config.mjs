/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@project-template/db', '@project-template/auth'],
  env: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL || 'http://localhost:3000',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
