import type {
  ActiveMissionsLabels, AgentTraceLabels, ApprovalChainLabels,
  AugmentedBrainLabels, AugmentedBrainV2Labels, ChatLabels,
  HubSpokeLabels, NeuralNodesLabels, ProcessTimelineLabels,
  WorkflowOrchestratorLabels,
} from "../types";

export const activeMissionsDefaults: ActiveMissionsLabels = {
  noActiveMissions: "No active missions.",
};

export const agentTraceDefaults: AgentTraceLabels = {
  input: "Input",
  output: "Output",
  noTraceSteps: "No trace steps to display.",
  actorLabel: "Actor",
  handoff: "Handoff",
  legend: "Legend",
};

export const approvalChainDefaults: ApprovalChainLabels = {
  approvalChain: "Approval chain",
};

export const augmentedBrainDefaults: AugmentedBrainLabels = {
  nodeTypeLegend: "Node type legend",
};

export const augmentedBrainV2Defaults: AugmentedBrainV2Labels = {
  pauseAnimation: "Pause animation",
  playAnimation: "Play animation",
};

export const chatDefaults: ChatLabels = {
  code: "code",
  copied: "Copied",
  copy: "Copy",
  stopListening: "Stop listening",
  processingSpeech: "Processing speech",
  voiceError: "Voice input error, click to retry",
  startVoiceInput: "Start voice input",
  thinking: "Thinking\u2026",
  voiceInput: "Voice input",
  sendMessage: "Send message",
};

export const hubSpokeDefaults: HubSpokeLabels = {
  networkNodes: "Network nodes",
  hub: "Hub:",
  active: "Active",
};

export const neuralNodesDefaults: NeuralNodesLabels = {
  neuralNodesVisualization: "Neural nodes visualization",
};

export const processTimelineDefaults: ProcessTimelineLabels = {
  defaultAriaLabel: "Process timeline",
  stepStatus: "status",
  duration: "Duration",
  noSteps: "No steps to display.",
};

export const workflowOrchestratorDefaults: WorkflowOrchestratorLabels = {
  workflowVisualization: "Workflow visualization",
  phase: "Phase",
  noNodes: "No workflow nodes to display.",
};
