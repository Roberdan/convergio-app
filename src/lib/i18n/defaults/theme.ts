import type {
  A11yFabLabels, A11yLabels, ThemeToggleLabels,
  ThemeRotaryLabels, FerrariControlLabels,
} from "../types";

export const a11yFabDefaults: A11yFabLabels = {
  accessibilitySettings: "Accessibility settings",
  accessibility: "Accessibility",
  textSize: "Text Size",
  lineSpacing: "Line Spacing",
  dyslexicFont: "OpenDyslexic Font",
  reducedMotion: "Reduced Motion",
  highContrast: "High Contrast",
  focusIndicators: "Focus Indicators",
  resetToDefaults: "Reset to Defaults",
  fontSizeLabels: { sm: "S", md: "M", lg: "L", xl: "XL" },
  lineSpacingLabels: { normal: "1×", relaxed: "1.5×", loose: "2×" },
};

export const a11yDefaults: A11yLabels = {
  displaySettings: "Display settings",
  accessibilitySettings: "Accessibility settings",
  display: "Display",
  textSize: "Text Size",
  reducedMotion: "Reduced Motion",
  highContrast: "High Contrast",
  focusIndicators: "Focus Indicators",
  resetToDefaults: "Reset to Defaults",
};

export const themeToggleDefaults: ThemeToggleLabels = {
  light: "Light",
  dark: "Dark",
  navy: "Navy",
  colorblind: "Colorblind",
  switchTheme: "Current theme: {theme}. Click to switch.",
};

export const themeRotaryDefaults: ThemeRotaryLabels = {
  themeSelector: "Theme selector",
};

export const ferrariControlDefaults: FerrariControlLabels = {
  manettinoSelector: "Manettino selector",
  cruiseLever: "Cruise lever",
  toggleLever: "Toggle lever",
  steppedRotary: "Stepped rotary",
  on: "ON",
  off: "OFF",
};
