import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Tests for POST /api/chat — daemon proxy route handler.
 *
 * Validates request body parsing, Zod validation errors,
 * auth checks, and daemon proxy behavior.
 */

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: () => ({ value: "authenticated.validsig" }),
  })),
}));

vi.mock("@/lib/session", () => ({
  verifyValue: vi.fn(() => Promise.resolve("authenticated")),
}));

vi.mock("@/lib/config-loader", () => ({
  loadAIConfig: vi.fn(() => ({
    defaultAgentId: "jervis",
    agents: [
      {
        id: "jervis",
        name: "Jervis",
        description: "Platform orchestrator for operations",
        provider: "openai" as const,
        model: "gpt-4o",
        systemPrompt: "You are Jervis, the Convergio assistant.",
        apiRoute: "/api/chat",
        maxTokens: 4096,
      },
    ],
  })),
}));

/* Daemon env vars — match the module-level constants in route.ts */
vi.stubEnv("API_URL", "http://localhost:8420");
vi.stubEnv("AUTH_TOKEN", "");

function chatRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/chat (daemon proxy)", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns 400 for invalid JSON body", async () => {
    const { POST } = await import("./route");
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      body: "not json{{{",
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error.code).toBe("INVALID_JSON");
  });

  it("returns 422 for missing messages field", async () => {
    const { POST } = await import("./route");
    const res = await POST(chatRequest({ agent: "jervis" }));

    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.error.code).toBe("VALIDATION_ERROR");
    expect(data.error.details).toBeDefined();
  });

  it("returns 422 for empty messages array", async () => {
    const { POST } = await import("./route");
    const res = await POST(chatRequest({ messages: [] }));

    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 422 for invalid message role", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      chatRequest({
        messages: [{ role: "moderator", content: "Hello" }],
      }),
    );

    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("proxies to daemon and streams response", async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("Hello from daemon"));
        controller.close();
      },
    });

    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(stream, {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
    );

    const { POST } = await import("./route");
    const res = await POST(
      chatRequest({
        messages: [{ role: "user", content: "What is the status?" }],
      }),
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("X-Agent")).toBe("jervis");

    /* Verify fetch was called with correct daemon URL */
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8420/api/kernel/ask",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
      }),
    );
  });

  it("proxies to org endpoint when orgId is provided", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response("ok", { status: 200 }),
    );

    const { POST } = await import("./route");
    await POST(
      chatRequest({
        messages: [{ role: "user", content: "Hello" }],
        agent: "nasra",
        orgId: "org-42",
      }),
    );

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8420/api/orgs/org-42/ask",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("returns 502 when daemon is unreachable", async () => {
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("ECONNREFUSED"));

    const { POST } = await import("./route");
    const res = await POST(
      chatRequest({
        messages: [{ role: "user", content: "Hello" }],
      }),
    );

    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.error.code).toBe("DAEMON_ERROR");
  });

  it("returns daemon error status on non-ok response", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response("Agent not found", { status: 404 }),
    );

    const { POST } = await import("./route");
    const res = await POST(
      chatRequest({
        messages: [{ role: "user", content: "Hello" }],
      }),
    );

    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error.code).toBe("DAEMON_ERROR");
  });
});
