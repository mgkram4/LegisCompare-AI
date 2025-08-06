import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverMinification: false,
  },
  images: {
    domains: ['source.unsplash.com'],
  },
  webpack: (config) => {
    // Aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname),
    };

    return config;
  },
};

export default nextConfig;
