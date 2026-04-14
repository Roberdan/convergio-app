import { cookies } from "next/headers";
import { openai, createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { spawn } from "node:child_process";
import { z } from "zod";
import { loadAIConfig } from "@/lib/config-loader";
import { verifyValue } from "@/lib/session";
import type { AgentConfig } from "@/types/ai";

/**
 * POST /api/chat — streaming chat completions.
 *
 * Requires authenticated session cookie.
 * Accepts: { messages, agentId? }
 * Input is validated with Zod before processing.
 *
 * Provider routing is config-driven via convergio.yaml:
 * - "openai"   → Vercel AI SDK (OpenAI API)
 * - "qwen"     → Vercel AI SDK (DashScope OpenAI-compatible API)
 * - "qwen-cli" → Spawns local `qwen` CLI with stream-json output
 */

const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().min(1),
  })).min(1),
  agentId: z.string().optional(),
});

function resolveModel(agent: AgentConfig) {
  switch (agent.provider) {
    case "openai":
      return openai(agent.model);
    case "qwen": {
      const qwen = createOpenAI({
        baseURL: process.env.QWEN_BASE_URL ?? "https://dashscope.aliyuncs.com/compatible-mode/v1",
        apiKey: process.env.QWEN_API_KEY ?? "",
      });
      return qwen(agent.model);
    }
    case "anthropic":
      throw new Error(
        `Provider "anthropic" not configured for agent "${agent.id}".`,
      );
    case "custom":
      throw new Error(
        `Provider "custom" not configured for agent "${agent.id}".`,
      );
    case "qwen-cli":
      throw new Error("qwen-cli uses streamViaCli, not resolveModel.");
    default: {
      const exhaustive: never = agent.provider;
      throw new Error(`Unknown provider "${exhaustive}".`);
    }
  }
}

/** Spawn `qwen` CLI and stream text chunks back as a ReadableStream. */
function streamViaCli(
  agent: AgentConfig,
  userPrompt: string,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const args = [
    "--output-format", "stream-json",
    "--system-prompt", agent.systemPrompt,
    ...(agent.model ? ["--model", agent.model] : []),
    "--max-session-turns", "1",
    userPrompt,
  ];

  return new ReadableStream({
    start(controller) {
      const proc = spawn("qwen", args, {
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, NO_COLOR: "1" },
      });

      let buffer = "";

      proc.stdout.on("data", (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const evt = JSON.parse(line);
            if (evt.type === "assistant" && Array.isArray(evt.message?.content)) {
              for (const block of evt.message.content) {
                if (block.type === "text" && block.text) {
                  controller.enqueue(encoder.encode(block.text));
                }
              }
            }
          } catch {
            /* skip malformed lines */
          }
        }
      });

      proc.stderr.on("data", () => { /* swallow stderr */ });

      proc.on("close", () => {
        if (buffer.trim()) {
          try {
            const evt = JSON.parse(buffer);
            if (evt.type === "assistant" && Array.isArray(evt.message?.content)) {
              for (const block of evt.message.content) {
                if (block.type === "text" && block.text) {
                  controller.enqueue(encoder.encode(block.text));
                }
              }
            }
          } catch { /* ignore */ }
        }
        controller.close();
      });

      proc.on("error", (err) => {
        controller.error(err);
      });
    },
  });
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

  const { messages, agentId } = parsed.data;
  const aiConfig = loadAIConfig();

  const agent =
    aiConfig.agents.find((a) => a.id === (agentId ?? aiConfig.defaultAgentId)) ??
    aiConfig.agents[0];

  if (!agent) {
    return Response.json(
      { error: { code: "NO_AGENT", message: "No AI agents configured" } },
      { status: 503 },
    );
  }

  /* CLI-based providers: bypass Vercel AI SDK, spawn local process */
  if (agent.provider === "qwen-cli") {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) {
      return Response.json(
        { error: { code: "NO_USER_MESSAGE", message: "No user message found" } },
        { status: 422 },
      );
    }
    const stream = streamViaCli(agent, lastUserMsg.content);
    const response = new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-RateLimit-Limit": "60",
        "X-RateLimit-Remaining": "59",
      },
    });
    return response;
  }

  /* SDK-based providers: resolve model and stream via Vercel AI SDK */

  let model;
  try {
    model = resolveModel(agent);
  } catch (err) {
    return Response.json(
      { error: { code: "PROVIDER_ERROR", message: (err as Error).message } },
      { status: 501 },
    );
  }

  const result = streamText({
    model,
    system: agent.systemPrompt,
    messages,
    ...(agent.maxTokens ? { maxOutputTokens: agent.maxTokens } : {}),
  });

  const response = result.toTextStreamResponse();
  response.headers.set("X-RateLimit-Limit", "60");
  response.headers.set("X-RateLimit-Remaining", "59");
  return response;
}
