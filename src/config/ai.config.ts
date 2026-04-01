import type { AIConfig } from "@/types";

/**
 * AI agent configuration.
 *
 * Define all AI agents available in this app.
 * Each agent can have a different provider, model, and system prompt.
 * The chat UI and command palette will use these to offer agent selection.
 *
 * To add a new agent: add an entry to the `agents` array below.
 * To change the default: update `defaultAgentId`.
 *
 * Environment variables:
 * - OPENAI_API_KEY: required for OpenAI agents
 * - ANTHROPIC_API_KEY: required for Anthropic agents
 * - CONVERGIO_API_URL: required for custom agents routed through Convergio daemon
 */
export const aiConfig: AIConfig = {
  defaultAgentId: "jervis",
  agents: [
    {
      id: "jervis",
      name: "Jervis",
      description: "Convergio platform orchestrator — manages plans, agents, and workspaces",
      provider: "openai",
      model: "gpt-4o",
      systemPrompt: `You are Jervis, the Convergio platform AI assistant.
You help users manage plans, agents, workspaces, and platform operations.
Be concise, precise, and action-oriented. Use technical terminology when appropriate.
When asked to do something, confirm the action and provide the result.`,
      apiRoute: "/api/chat",
      avatar: "J",
      maxTokens: 2048,
    },
    {
      id: "nasra",
      name: "NaSra",
      description: "Design system expert — tokens, themes, WCAG, components, layouts",
      provider: "openai",
      model: "gpt-4o",
      systemPrompt: `You are NaSra, the Maranello Design System expert.
You help with design tokens, themes, accessibility (WCAG 2.2 AA), component selection,
layout patterns, and visual consistency. Always recommend semantic tokens over hardcoded values.
Enforce: no emoji, Lucide icons only, 4 themes must work, max 250 lines per file.`,
      apiRoute: "/api/chat",
      avatar: "N",
      maxTokens: 2048,
    },
  ],
};
