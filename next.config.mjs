import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Ensure App Router is enabled
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve('./src');
    return config;
  },
  redirects: async () => [
    {
      source: '/',
      destination: '/auth/sign-in',
      permanent: true,
    },
  ],
};

export default nextConfig;
