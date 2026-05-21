import { withGluestackUI } from '@gluestack/ui-next-adapter';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@app-template/app',
    '@app-template/ui',
    'react-native',
    'react-native-web',
    'solito',
    'nativewind',
    'react-native-css-interop',
    '@gluestack-ui/core',
    '@gluestack-ui/utils',
  ],
  env: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL || 'http://localhost:3000',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    return config;
  },
};

export default withGluestackUI(nextConfig);
