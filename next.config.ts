import type { NextConfig } from "next";

// When building for Tauri desktop, we need a static export (no server, no rewrites).
// Set TAURI_BUILD=1 to enable this mode (done automatically by tauri.conf.json beforeBuildCommand).
const isTauriBuild = process.env.TAURI_BUILD === "1";

// API proxying is handled by src/app/api/[...path]/route.ts (adds auth).
// Do NOT use rewrites for /api/* — they bypass the route handler and lose auth.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

const nextConfig: NextConfig = {
  ...(isTauriBuild ? { output: "export" } : {}),
  allowedDevOrigins: ["127.0.0.1", "localhost", "10.0.0.1"],
  headers: async () => [
    { source: "/(.*)", headers: securityHeaders },
  ],
};

export default nextConfig;
