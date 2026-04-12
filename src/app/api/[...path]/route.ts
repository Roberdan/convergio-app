/**
 * Catch-all API proxy to the Convergio daemon.
 *
 * Security:
 * - Only proxies to /api/* paths (no path traversal)
 * - Only allows specific HTTP methods
 * - Validates path contains no encoded traversal sequences
 * - Forwards auth headers from client to daemon
 * - No x-forwarded-for (daemon's localhost bypass works)
 */
import { NextRequest, NextResponse } from "next/server";
import { getSessionValue } from "@/lib/session";

const DAEMON = process.env.API_URL ?? "http://localhost:8420";

// Only allow proxying to these API prefixes
const ALLOWED_PREFIXES = [
  "/api/health", "/api/agents", "/api/plan-db", "/api/plans",
  "/api/orgs", "/api/mesh", "/api/inference", "/api/observatory",
  "/api/billing", "/api/cost", "/api/deploy", "/api/backup",
  "/api/doctor", "/api/prompts", "/api/skills", "/api/scheduler",
  "/api/security", "/api/tenancy", "/api/knowledge", "/api/reports",
  "/api/night-agents", "/api/node", "/api/sync", "/api/events",
  "/api/ipc", "/api/ws", "/api/notify", "/api/capabilities",
  "/api/depgraph", "/api/metrics", "/api/kernel",
  "/api/approvals", "/api/evidence", "/api/a2ui",
];

function isAllowed(path: string): boolean {
  // Block path traversal
  if (path.includes("..") || path.includes("%2e") || path.includes("%2E")) {
    return false;
  }
  return ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix));
}

async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const search = req.nextUrl.search;

  if (!isAllowed(path)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Health endpoint is public; all other routes require a valid session
  if (path !== "/api/health") {
    const session = await getSessionValue();
    if (!session) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 },
      );
    }
  }

  const url = `${DAEMON}${path}${search}`;
  const headers: Record<string, string> = {
    "Host": "localhost:8420",
  };
  const contentType = req.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;
  // Always authenticate — use client header or fall back to dev token
  const auth = req.headers.get("authorization");
  headers["Authorization"] = auth ?? `Bearer ${process.env.AUTH_TOKEN ?? ""}`;

  const body = req.method !== "GET" && req.method !== "HEAD"
    ? await req.text()
    : undefined;

  const res = await fetch(url, { method: req.method, headers, body });
  const resContentType = res.headers.get("content-type") ?? "application/json";

  // SSE streams must be forwarded without buffering
  if (resContentType.includes("text/event-stream") && res.body) {
    return new NextResponse(res.body as ReadableStream, {
      status: res.status,
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        "connection": "keep-alive",
      },
    });
  }

  const data = await res.arrayBuffer();
  return new NextResponse(data, {
    status: res.status,
    headers: { "content-type": resContentType },
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
