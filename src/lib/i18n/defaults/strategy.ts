import type {
  BusinessModelCanvasLabels, CustomerJourneyMapLabels,
  CustomerJourneyLabels, DecisionMatrixLabels, OkrLabels,
  RiskMatrixLabels, StrategyCanvasLabels, SwotLabels,
  NineBoxMatrixLabels, PorterFiveForcesLabels,
} from "../types";

export const businessModelCanvasDefaults: BusinessModelCanvasLabels = {
  enterItem: "Enter item\u2026",
  confirm: "Confirm",
  businessModelCanvas: "Business Model Canvas",
};

export const customerJourneyMapDefaults: CustomerJourneyMapLabels = {
  noTouchpoints: "No touchpoints",
};

export const customerJourneyDefaults: CustomerJourneyLabels = {
  customerJourney: "Customer journey",
};

export const decisionMatrixDefaults: DecisionMatrixLabels = {
  option: "Option",
  total: "Total",
  winner: "Winner",
  best: "BEST",
};

export const okrDefaults: OkrLabels = {
  noObjectives: "No objectives defined.",
};

export const riskMatrixDefaults: RiskMatrixLabels = {
  impact: "Impact",
  probability: "Probability",
  critical: "Critical",
};

export const strategyCanvasDefaults: StrategyCanvasLabels = {
  newItem: "New item...",
  cancel: "Cancel",
  add: "+ Add",
};

export const swotDefaults: SwotLabels = {
  noItems: "No items",
};

export const nineBoxMatrixDefaults: NineBoxMatrixLabels = {
  performance: "Performance",
  potential: "Potential",
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const porterFiveForcesDefaults: PorterFiveForcesLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
  porterFiveForces: "Porter's Five Forces",
};
