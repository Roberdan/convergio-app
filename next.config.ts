import type { NextConfig } from "next";

// When building for Tauri desktop, we need a static export (no server, no rewrites).
// Set TAURI_BUILD=1 to enable this mode (done automatically by tauri.conf.json beforeBuildCommand).
const isTauriBuild = process.env.TAURI_BUILD === "1";

// API proxying is handled by src/app/api/[...path]/route.ts (adds auth).
// Do NOT use rewrites for /api/* — they bypass the route handler and lose auth.
const nextConfig: NextConfig = {
  ...(isTauriBuild ? { output: "export" } : {}),
  allowedDevOrigins: ["127.0.0.1", "localhost", "10.0.0.1"],
};

export default nextConfig;
