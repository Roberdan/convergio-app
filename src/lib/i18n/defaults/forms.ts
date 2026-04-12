import type {
  AsyncSelectLabels, CalendarRangeLabels, DatePickerLabels,
  DateRangePickerLabels, FilterPanelLabels, LoginLabels,
  ProfileLabels, SearchDrawerLabels, VoiceInputLabels,
} from "../types";

export const asyncSelectDefaults: AsyncSelectLabels = {
  loading: "Loading\u2026",
  noResults: "No results",
};

export const calendarRangeDefaults: CalendarRangeLabels = {
  dateRange: "Date range",
};

export const datePickerDefaults: DatePickerLabels = {
  datePicker: "Date picker",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  today: "Today",
};

export const dateRangePickerDefaults: DateRangePickerLabels = {
  dateRangePicker: "Date range picker",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  cancel: "Cancel",
  apply: "Apply",
};

export const filterPanelDefaults: FilterPanelLabels = {
  filterPlaceholder: "Filter by actor, action, or target...",
  searchPlaceholder: "Search\u2026",
  clear: "Clear",
  clearAll: "Clear all",
  filters: "Filters",
  activeFilter: "active filter",
  activeFilters: "active filters",
};

export const loginDefaults: LoginLabels = {
  signIn: "Sign in",
  email: "Email",
  emailPlaceholder: "you@example.com",
  password: "Password",
  hidePassword: "Hide password",
  showPassword: "Show password",
  forgotPassword: "Forgot password?",
  serviceStatus: "Service status",
};

export const profileDefaults: ProfileLabels = {
  profileMenu: "Profile menu",
};

export const searchDrawerDefaults: SearchDrawerLabels = {
  close: "Close",
  searchResults: "Search results",
};

export const voiceInputDefaults: VoiceInputLabels = {
  stopListening: "Stop listening",
  processingSpeech: "Processing speech",
  voiceError: "Voice input error, click to retry",
  startVoiceInput: "Start voice input",
};
