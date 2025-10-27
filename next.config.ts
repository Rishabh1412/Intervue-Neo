import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { // ✅ correct casing
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
