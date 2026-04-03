import type { PropRow } from "./component-doc"

/**
 * Props documentation for the top Maranello components.
 * Keyed by component slug (matches CatalogEntry.slug).
 */
export const COMPONENT_PROPS: Record<string, PropRow[]> = {
  // ── data-display ──────────────────────────────────────────────────────
  "mn-badge": [
    { name: "label", type: "string", description: "Text content of the badge" },
    { name: "tone", type: '"success" | "warning" | "danger" | "info" | "neutral"', default: '"neutral"', description: "Semantic colour tone" },
  ],
  "mn-spinner": [
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Diameter of the spinner" },
    { name: "variant", type: '"primary" | "muted" | "destructive"', default: '"primary"', description: "Colour variant" },
    { name: "label", type: "string", default: '"Loading"', description: "Accessible label read by screen readers" },
  ],
  "mn-progress-ring": [
    { name: "value", type: "number", default: "0", description: "Current progress value" },
    { name: "max", type: "number", default: "100", description: "Maximum value for the ring" },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Ring diameter preset" },
    { name: "variant", type: '"primary" | "muted" | "success" | "destructive"', default: '"primary"', description: "Colour variant" },
    { name: "animate", type: "boolean", default: "true", description: "Enable transition animation" },
    { name: "label", type: "string", description: "Accessible label for the ring" },
  ],
  "mn-data-table": [
    { name: "columns", type: "DataTableColumn<T>[]", description: "Column definitions with key, label, type, sortable, filterable" },
    { name: "data", type: "T[]", description: "Array of row objects" },
    { name: "pageSize", type: "number", default: "0", description: "Rows per page (0 = no pagination)" },
    { name: "groupBy", type: "string", description: "Column key to group rows by" },
    { name: "selectable", type: '"none" | "single" | "multi"', description: "Row selection mode" },
    { name: "compact", type: "boolean", default: "false", description: "Use denser row spacing" },
    { name: "loading", type: "boolean", default: "false", description: "Show skeleton loading state" },
    { name: "emptyMessage", type: "string", default: '"No data found"', description: "Text shown when data is empty" },
    { name: "onRowClick", type: "(row: T) => void", description: "Callback when a row is clicked" },
    { name: "onSort", type: "(key: string, dir: SortDir) => void", description: "Callback when sort changes" },
  ],
  "mn-kpi-scorecard": [
    { name: "rows", type: "KpiRow[]", description: "Array of KPI rows to display" },
    { name: "currency", type: "string", default: '"$"', description: "Currency symbol prefix" },
    { name: "onSelect", type: "(row: KpiRow) => void", description: "Callback when a row is selected" },
    { name: "ariaLabel", type: "string", default: '"KPI Scorecard"', description: "Accessible label for the scorecard" },
  ],
  "mn-avatar": [
    { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Avatar diameter preset" },
    { name: "src", type: "string", description: "URL for the avatar image" },
    { name: "alt", type: "string", default: '""', description: "Alt text for the image" },
    { name: "initials", type: "string", description: "Fallback initials when no image is provided" },
    { name: "status", type: '"online" | "busy" | "away" | "offline"', description: "Presence indicator dot" },
  ],
  "mn-activity-feed": [
    { name: "items", type: "ActivityItem[]", description: "Array of activity items to render" },
    { name: "onRefresh", type: "() => void", description: "Callback to refresh the feed" },
    { name: "refreshInterval", type: "number", default: "30000", description: "Auto-refresh interval in ms" },
    { name: "ariaLabel", type: "string", default: '"Activity feed"', description: "Accessible label for the feed region" },
  ],

  // ── data-viz ──────────────────────────────────────────────────────────
  "mn-chart": [
    { name: "type", type: '"sparkline" | "donut" | "area" | "bar" | "radar" | "bubble"', description: "Chart visualisation type" },
    { name: "series", type: "ChartSeries[]", default: "[]", description: "Data series for line/area/bar charts" },
    { name: "segments", type: "DonutSegment[]", default: "[]", description: "Segments for donut charts" },
    { name: "points", type: "BubblePoint[]", default: "[]", description: "Points for bubble charts" },
    { name: "radarData", type: "RadarPoint[]", default: "[]", description: "Data points for radar charts" },
    { name: "labels", type: "string[]", default: "[]", description: "X-axis or category labels" },
    { name: "showLegend", type: "boolean", default: "false", description: "Display the chart legend" },
    { name: "animate", type: "boolean", default: "true", description: "Enable entry animations" },
  ],
  "mn-gauge": [
    { name: "value", type: "number", default: "0", description: "Current gauge value" },
    { name: "min", type: "number", default: "0", description: "Minimum scale value" },
    { name: "max", type: "number", default: "100", description: "Maximum scale value" },
    { name: "unit", type: "string", description: "Unit label (e.g. '%', 'rpm')" },
    { name: "label", type: "string", description: "Descriptive label below the value" },
    { name: "ticks", type: "number", default: "10", description: "Number of major tick marks" },
    { name: "size", type: '"sm" | "md" | "lg" | "fluid"', default: '"md"', description: "Gauge diameter preset" },
    { name: "animate", type: "boolean", default: "true", description: "Animate needle on value change" },
  ],
  "mn-speedometer": [
    { name: "value", type: "number", default: "0", description: "Current speed value" },
    { name: "min", type: "number", default: "0", description: "Minimum scale value" },
    { name: "max", type: "number", default: "320", description: "Maximum scale value" },
    { name: "unit", type: "string", default: '"km/h"', description: "Unit label" },
    { name: "ticks", type: "number[]", description: "Explicit major tick positions" },
    { name: "minorTicks", type: "number", default: "4", description: "Minor ticks between each major tick" },
    { name: "animate", type: "boolean", default: "true", description: "Animate needle transitions" },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Speedometer size preset" },
    { name: "subLabel", type: "string | null", default: "null", description: "Secondary label below the value" },
  ],

  // ── feedback ──────────────────────────────────────────────────────────
  "mn-modal": [
    { name: "open", type: "boolean", description: "Whether the modal is visible" },
    { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes" },
    { name: "title", type: "string", description: "Dialog title rendered in the header" },
    { name: "size", type: '"sm" | "default" | "lg" | "xl" | "full"', default: '"default"', description: "Maximum width of the modal" },
    { name: "closeOnBackdropClick", type: "boolean", default: "true", description: "Close when clicking backdrop" },
    { name: "closeOnEscape", type: "boolean", default: "true", description: "Close when pressing Escape" },
  ],
  "mn-toast": [
    { name: "className", type: "string", description: "Additional CSS classes for the toast container" },
  ],

  // ── forms ─────────────────────────────────────────────────────────────
  "mn-form-field": [
    { name: "fieldId", type: "string", description: "HTML id linking label to input" },
    { name: "label", type: "string", description: "Field label text" },
    { name: "hint", type: "string", description: "Help text below the input" },
    { name: "error", type: "string", description: "Error message (replaces hint when set)" },
    { name: "required", type: "boolean", description: "Mark field as required" },
    { name: "size", type: '"default" | "sm" | "lg"', default: '"default"', description: "Field size variant" },
  ],
  "mn-search-drawer": [
    { name: "open", type: "boolean", description: "Whether the drawer is visible" },
    { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes" },
    { name: "title", type: "string", description: "Drawer header title" },
    { name: "placeholder", type: "string", default: '"Search…"', description: "Search input placeholder" },
    { name: "onSearch", type: "(query: string) => Promise<SearchDrawerResult[]>", description: "Async search handler" },
    { name: "onResultClick", type: "(result: SearchDrawerResult) => void", description: "Callback when a result is clicked" },
    { name: "emptyMessage", type: "string", default: '"No results found"', description: "Text shown when search yields no results" },
  ],
  "mn-filter-panel": [
    { name: "sections", type: "FilterSection[]", description: "Array of filter section configs" },
    { name: "filters", type: "ActiveFilters", description: "Currently active filter values" },
    { name: "onFilterChange", type: "(filters: ActiveFilters) => void", description: "Callback on each filter change" },
    { name: "onApply", type: "(filters: ActiveFilters) => void", description: "Callback when apply is clicked" },
    { name: "clearAllLabel", type: "string", default: '"Clear all"', description: "Label for the clear button" },
    { name: "applyLabel", type: "string", default: '"Apply filters"', description: "Label for the apply button" },
    { name: "size", type: '"default" | "wide" | "compact" | "full"', default: '"default"', description: "Panel width preset" },
  ],
  "mn-toggle-switch": [
    { name: "checked", type: "boolean", description: "Whether the switch is on" },
    { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Callback when toggled" },
    { name: "label", type: "string", description: "Visible label text" },
    { name: "disabled", type: "boolean", default: "false", description: "Disable interaction" },
    { name: "size", type: '"sm" | "md"', default: '"md"', description: "Switch size variant" },
  ],
  "mn-calendar-range": [
    { name: "value", type: "DateRange", description: "Current date range ({ start, end })" },
    { name: "onChange", type: "(range: DateRange) => void", description: "Callback when range changes" },
    { name: "minDate", type: "string", description: "Earliest selectable date (ISO 8601)" },
    { name: "maxDate", type: "string", description: "Latest selectable date (ISO 8601)" },
    { name: "startLabel", type: "string", default: '"Start date"', description: "Label for the start picker" },
    { name: "endLabel", type: "string", default: '"End date"', description: "Label for the end picker" },
  ],

  // ── navigation ────────────────────────────────────────────────────────
  "mn-tabs": [
    { name: "value", type: "string", description: "Controlled active tab value" },
    { name: "defaultValue", type: "string", description: "Initial tab when uncontrolled" },
    { name: "onValueChange", type: "(value: string) => void", description: "Callback when active tab changes" },
  ],
  "mn-stepper": [
    { name: "steps", type: "Step[]", description: "Array of { label, description? } step definitions" },
    { name: "currentStep", type: "number", description: "Zero-based index of the active step" },
    { name: "onChange", type: "(step: number) => void", description: "Callback when a step is clicked" },
  ],
  "mn-breadcrumb": [
    { name: "items", type: "BreadcrumbItem[]", description: "Array of { label, href?, current? } crumbs" },
    { name: "separator", type: "ReactNode", default: '"›"', description: "Custom separator between items" },
    { name: "onNavigate", type: "(item, index, event) => void", description: "Callback when a breadcrumb is clicked" },
    { name: "size", type: '"default" | "sm" | "lg"', default: '"default"', description: "Text size variant" },
  ],

  // ── layout ────────────────────────────────────────────────────────────
  "mn-grid-layout": [
    { name: "columns", type: "1 | 2 | 3 | 4 | 5 | 6 | 12", default: "1", description: "Number of grid columns" },
    { name: "breakpoints", type: "{ sm?, md?, lg?, xl? }", description: "Responsive column overrides per breakpoint" },
    { name: "gap", type: '"none" | "xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "Gap between grid items" },
    { name: "align", type: '"start" | "center" | "end" | "stretch"', default: '"stretch"', description: "Vertical alignment of items" },
  ],
  "mn-section-card": [
    { name: "title", type: "string", description: "Card header title" },
    { name: "action", type: "SectionCardAction", description: "Optional header action button config" },
    { name: "badge", type: "number", description: "Numeric badge in the header" },
    { name: "collapsible", type: "boolean", default: "true", description: "Allow collapsing the card body" },
    { name: "defaultOpen", type: "boolean", default: "true", description: "Initial open state when collapsible" },
    { name: "noPadding", type: "boolean", default: "false", description: "Remove default body padding" },
    { name: "variant", type: '"default" | "flat"', default: '"default"', description: "Visual style variant" },
  ],

  // ── theme ─────────────────────────────────────────────────────────────
  "mn-dropdown-menu": [
    { name: "trigger", type: "ReactNode", description: "Element that opens the menu on click" },
    { name: "children", type: "ReactNode", description: "Menu items (MnDropdownItem, MnDropdownSeparator, etc.)" },
    { name: "align", type: '"start" | "end"', default: '"start"', description: "Horizontal alignment relative to trigger" },
  ],

  // ── data-display (extra) ──────────────────────────────────────────────
  "mn-detail-panel": [
    { name: "open", type: "boolean", description: "Whether the panel is visible" },
    { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes" },
    { name: "title", type: "string", description: "Panel header title" },
    { name: "sections", type: "DetailSection[]", description: "Array of field sections to render" },
    { name: "editable", type: "boolean", default: "true", description: "Show edit/save controls" },
    { name: "defaultEditing", type: "boolean", default: "false", description: "Start in editing mode" },
    { name: "onSave", type: "(data: Record<string, unknown>) => void", description: "Callback when changes are saved" },
    { name: "size", type: '"default" | "sm" | "lg" | "xl"', default: '"default"', description: "Panel width preset" },
  ],
}
