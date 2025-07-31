import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverMinification: false,
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
