/** @convergio/core/hooks — Data fetching and SSE hooks. */
export { useApiQuery } from "@/hooks/use-api-query";
export { useEventSource } from "@/hooks/use-event-source";
export { useSSEAdapter } from "@/hooks/use-sse-adapter";
export {
  useBrain3DLive,
  useAgentTraceLive,
  useHubSpokeLive,
  useApprovalChainLive,
  useActiveMissionsLive,
} from "@/hooks/use-sse-adapter.convenience";
