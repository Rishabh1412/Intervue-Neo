import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: { // ✅ correct casing
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
