import { cookies } from "next/headers";
import { z } from "zod";
import { verifyValue } from "@/lib/session";
import { loadAIConfig } from "@/lib/config-loader";

/**
 * POST /api/chat — streaming proxy to the Convergio daemon kernel.
 *
 * Proxies chat requests to the daemon's /api/kernel/ask endpoint,
 * or /api/orgs/:orgId/ask for org-scoped agents.
 *
 * Requires authenticated session cookie.
 * Accepts: { messages, agent?, orgId? }
 * Streams the daemon response back to the client.
 */

const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().min(1),
  })).min(1),
  agent: z.string().optional(),
  orgId: z.string().optional(),
});

/** Daemon base URL — consistent with api.ts client. */
const DAEMON_BASE = process.env.API_URL ?? "http://localhost:8420";

/** Auth token for daemon — matches CONVERGIO_AUTH_TOKEN on daemon side. */
const AUTH_TOKEN = process.env.AUTH_TOKEN ?? "";

function buildDaemonUrl(orgId?: string): string {
  if (orgId) {
    return `${DAEMON_BASE}/api/orgs/${encodeURIComponent(orgId)}/ask`;
  }
  return `${DAEMON_BASE}/api/kernel/ask`;
}

export async function POST(req: Request) {
  /* Auth gate: verify signed session cookie */
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie?.value) {
    return Response.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 },
    );
  }
  const sessionValue = await verifyValue(sessionCookie.value);
  if (!sessionValue) {
    return Response.json(
      { error: { code: "UNAUTHORIZED", message: "Invalid session" } },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: { code: "INVALID_JSON", message: "Request body must be valid JSON" } },
      { status: 400 },
    );
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    return Response.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid request", details } },
      { status: 422 },
    );
  }

  const { messages, agent: agentParam, orgId } = parsed.data;
  const agentName = agentParam ?? "jervis";

  /* Resolve agent config for display metadata (optional — proxy works without it) */
  const aiConfig = loadAIConfig();
  const agentConfig = aiConfig.agents.find((a) => a.id === agentName);

  const daemonUrl = buildDaemonUrl(orgId);

  const daemonPayload = {
    agent: agentName,
    messages,
    stream: true,
    ...(agentConfig?.systemPrompt ? { system_prompt: agentConfig.systemPrompt } : {}),
  };

  let upstream: Response;
  try {
    upstream = await fetch(daemonUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
      },
      body: JSON.stringify(daemonPayload),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Daemon unreachable";
    return Response.json(
      { error: { code: "DAEMON_ERROR", message } },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "Unknown error");
    return Response.json(
      { error: { code: "DAEMON_ERROR", message: text } },
      { status: upstream.status },
    );
  }

  /* Stream the daemon response back to the client */
  if (!upstream.body) {
    return Response.json(
      { error: { code: "DAEMON_ERROR", message: "No response body from daemon" } },
      { status: 502 },
    );
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Agent": agentName,
    },
  });
}
