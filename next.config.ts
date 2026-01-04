import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force build cache clear: 2026-01-05
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '30mb',
    },
  },
};

export default nextConfig;
