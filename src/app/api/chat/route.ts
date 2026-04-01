import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { loadAIConfig } from "@/lib/config-loader";
import type { AgentConfig } from "@/types/ai";

/**
 * POST /api/chat — streaming chat completions via Vercel AI SDK.
 *
 * Accepts: { messages, agentId? }
 * - messages: standard chat message array from useChat()
 * - agentId: optional, selects which agent config to use (default: aiConfig.defaultAgentId)
 *
 * Provider routing is config-driven: the agent's `provider` field in convergio.yaml
 * determines which SDK is used. Supported: "openai". Stubs: "anthropic", "custom".
 *
 * Environment: requires OPENAI_API_KEY for openai agents.
 */

function resolveModel(agent: AgentConfig) {
  switch (agent.provider) {
    case "openai":
      return openai(agent.model);
    case "anthropic":
      throw new Error(
        `Provider "anthropic" is not yet configured. Install @ai-sdk/anthropic and add ANTHROPIC_API_KEY to enable agent "${agent.id}".`,
      );
    case "custom":
      throw new Error(
        `Provider "custom" is not yet configured for agent "${agent.id}". Implement a custom provider adapter to enable this agent.`,
      );
    default: {
      const exhaustive: never = agent.provider;
      throw new Error(`Unknown provider "${exhaustive}" for agent "${agent.id}".`);
    }
  }
}

export async function POST(req: Request) {
  const aiConfig = loadAIConfig();
  const { messages, agentId } = await req.json();

  const agent =
    aiConfig.agents.find((a) => a.id === (agentId ?? aiConfig.defaultAgentId)) ??
    aiConfig.agents[0];

  let model;
  try {
    model = resolveModel(agent);
  } catch (err) {
    return new Response((err as Error).message, { status: 501 });
  }

  const result = streamText({
    model,
    system: agent.systemPrompt,
    messages,
    ...(agent.maxTokens ? { maxOutputTokens: agent.maxTokens } : {}),
  });

  return result.toTextStreamResponse();
}
