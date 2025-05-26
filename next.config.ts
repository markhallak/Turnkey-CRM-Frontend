import path from "path";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
