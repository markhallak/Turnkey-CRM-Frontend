// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["images.squarespace-cdn.com"],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias["@noble/ed25519"] = require.resolve("@noble/ed25519");

    // Inline any .wasm as base64 (for argon2-browser or other WASM modules)
    config.module.rules.push({
      test: /\.wasm$/,
      loader: "base64-loader",
      type: "javascript/auto",
    });

    // Don’t bundle Node-only modules into client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
};

export default nextConfig;
