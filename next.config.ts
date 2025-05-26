import path from "path";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Allows production builds to complete even if ESLint errors exist:
    ignoreDuringBuilds: true,
  },
  typescript: {
    // WARNING: Build will succeed despite any TS errors
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["images.squarespace-cdn.com"], // Add your allowed image domain here
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Redirect all imports from "next/link" to your custom LinkWrapper
      "next/link": path.resolve(__dirname, "components/CustomLink.tsx"),
    };
    return config;
  },
};

export default nextConfig;
