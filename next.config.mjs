import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { runtime: "edge" },
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve('./src');
    return config;
  }
};
export default nextConfig;

