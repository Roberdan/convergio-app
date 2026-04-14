import { spawn } from "node:child_process";
import type { AgentConfig } from "@/types/ai";

/** Extract text from a single NDJSON line based on CLI format. */
function extractCliText(line: string, provider: string): string | null {
  try {
    const evt = JSON.parse(line);

    if (provider === "copilot-cli") {
      if (evt.type === "assistant.message_delta" && evt.data?.deltaContent) {
        return evt.data.deltaContent;
      }
      return null;
    }

    // qwen-cli and claude-cli share the same event shape
    if (evt.type === "assistant" && Array.isArray(evt.message?.content)) {
      for (const block of evt.message.content) {
        if (block.type === "text" && block.text) return block.text;
      }
    }
  } catch { /* skip malformed lines */ }
  return null;
}

/** Build CLI args per provider. */
function buildCliArgs(provider: string, agent: AgentConfig, prompt: string): { bin: string; args: string[] } {
  switch (provider) {
    case "qwen-cli":
      return {
        bin: "qwen",
        args: [
          "--output-format", "stream-json",
          "--system-prompt", agent.systemPrompt,
          ...(agent.model ? ["--model", agent.model] : []),
          "--max-session-turns", "1",
          prompt,
        ],
      };
    case "claude-cli":
      return {
        bin: "claude",
        args: [
          "--output-format", "stream-json",
          "--verbose",
          ...(agent.model ? ["--model", agent.model] : []),
          "-p", prompt,
        ],
      };
    case "copilot-cli":
      return {
        bin: "copilot",
        args: [
          "--output-format", "json",
          "--no-color",
          ...(agent.model ? ["--model", agent.model] : []),
          "-p", prompt,
        ],
      };
    default:
      throw new Error(`Unknown CLI provider: ${provider}`);
  }
}

/** Spawn a CLI binary and stream text chunks back as a ReadableStream. */
export function streamViaCli(
  agent: AgentConfig,
  userPrompt: string,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const { bin, args } = buildCliArgs(agent.provider, agent, userPrompt);

  return new ReadableStream({
    start(controller) {
      const proc = spawn(bin, args, {
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
          const text = extractCliText(line, agent.provider);
          if (text) controller.enqueue(encoder.encode(text));
        }
      });

      proc.stderr.on("data", () => { /* swallow stderr */ });

      proc.on("close", () => {
        if (buffer.trim()) {
          const text = extractCliText(buffer, agent.provider);
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      });

      proc.on("error", (err) => {
        controller.error(err);
      });
    },
  });
}

/** Check whether a provider routes through CLI spawn. */
export function isCliProvider(provider: string): boolean {
  return provider === "qwen-cli" || provider === "claude-cli" || provider === "copilot-cli";
}
