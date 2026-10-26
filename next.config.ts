import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  cacheComponents: false,
  partialPrefetching: false,
  experimental: {
    agentUpgrade: "security",
  },
  // lets the dev server answer requests that come through an ngrok tunnel
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
