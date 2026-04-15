import type { NextConfig } from "next";

const DAEMON_URL = process.env.API_URL ?? "http://localhost:8420";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "10.0.0.1"],
  async rewrites() {
    return {
      // "beforeFiles" rewrites run before API routes, but only for non-existent paths
      // "afterFiles" rewrites run after API routes — so Next.js /api/chat and /api/health
      // are served first, and everything else is proxied to the daemon
      afterFiles: [
        {
          source: "/api/:path*",
          destination: `${DAEMON_URL}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
