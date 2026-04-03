'use client';

import { useState } from 'react';
import {
  MnSpinner,
  MnStepper,
  MnToggleSwitch,
  MnDropdownMenu,
  MnDropdownItem,
  MnDropdownSeparator,
  MnDropdownLabel,
  MnCalendarRange,
  MnAvatar,
  MnAvatarGroup,
  MnDataTable,
  MnDetailPanel,
} from '@/components/maranello';
import type { DateRange, DataTableColumn } from '@/components/maranello';
import { CATALOG } from '@/lib/component-catalog';
import { ComponentDoc } from './component-doc';
import { COMPONENT_PROPS } from './component-props';
import { stepperSteps } from './showcase-data';

function entry(slug: string) {
  const e = CATALOG.find((c) => c.slug === slug);
  if (!e) throw new Error(`Missing catalog entry: ${slug}`);
  return e;
}

const tableColumns: DataTableColumn<Record<string, unknown>>[] = [
  { key: 'name', label: 'Agent', sortable: true, filterable: true },
  { key: 'status', label: 'Status', type: 'status', sortable: true },
  { key: 'tasks', label: 'Tasks', sortable: true },
  { key: 'latency', label: 'Latency', sortable: true },
];

const tableData = [
  { name: 'Orchestrator', status: 'active', tasks: 1247, latency: '45ms' },
  { name: 'Planner', status: 'active', tasks: 892, latency: '120ms' },
  { name: 'Code Generator', status: 'warning', tasks: 634, latency: '380ms' },
  { name: 'Reviewer', status: 'active', tasks: 421, latency: '90ms' },
  { name: 'Deployer', status: 'inactive', tasks: 0, latency: '—' },
];

/** Section: W1 Accessibility + Utilities components. */
export function ShowcaseUtilities() {
  const [toggleA, setToggleA] = useState(true);
  const [toggleB, setToggleB] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: '2026-03-01',
    end: '2026-04-01',
  });
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <section aria-labelledby="section-utilities">
      <h2 id="section-utilities" className="text-lg font-semibold mb-4">
        W1 — Utilities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Avatar */}
        <ComponentDoc
          entry={entry('mn-avatar')}
          props={COMPONENT_PROPS['mn-avatar']}
          example={`<MnAvatar initials="AL" size="sm" status="online" />
<MnAvatarGroup max={3}>
  <MnAvatar initials="TS" size="md" />
  <MnAvatar initials="PL" size="md" />
</MnAvatarGroup>`}
        >
          <div className="flex items-center gap-4">
            <MnAvatar initials="AL" size="sm" status="online" />
            <MnAvatar initials="MR" size="md" status="busy" />
            <MnAvatar initials="JK" size="lg" status="away" />
            <MnAvatarGroup max={3}>
              <MnAvatar initials="TS" size="md" />
              <MnAvatar initials="PL" size="md" />
              <MnAvatar initials="KW" size="md" />
              <MnAvatar initials="RD" size="md" />
              <MnAvatar initials="NM" size="md" />
            </MnAvatarGroup>
          </div>
        </ComponentDoc>

        {/* Spinners */}
        <ComponentDoc
          entry={entry('mn-spinner')}
          props={COMPONENT_PROPS['mn-spinner']}
          example={`<MnSpinner size="sm" variant="primary" label="Loading" />
<MnSpinner size="md" variant="muted" label="Processing" />
<MnSpinner size="lg" variant="destructive" label="Error state" />`}
        >
          <div className="flex items-center gap-4">
            <MnSpinner size="sm" variant="primary" label="Loading" />
            <MnSpinner size="md" variant="muted" label="Processing" />
            <MnSpinner size="lg" variant="destructive" label="Error state" />
          </div>
        </ComponentDoc>

        {/* Toggles */}
        <ComponentDoc
          entry={entry('mn-toggle-switch')}
          props={COMPONENT_PROPS['mn-toggle-switch']}
          example={`<MnToggleSwitch
  checked={enabled}
  onCheckedChange={setEnabled}
  label="Auto-deploy"
/>`}
        >
          <div className="flex flex-col gap-2">
            <MnToggleSwitch checked={toggleA} onCheckedChange={setToggleA} label="Auto-deploy" />
            <MnToggleSwitch checked={toggleB} onCheckedChange={setToggleB} label="Reduced motion" size="sm" />
          </div>
        </ComponentDoc>

        {/* Stepper */}
        <ComponentDoc
          entry={entry('mn-stepper')}
          props={COMPONENT_PROPS['mn-stepper']}
          example={`<MnStepper
  steps={[{ label: "Plan" }, { label: "Review" }, { label: "Deploy" }]}
  currentStep={1}
  onChange={setStep}
/>`}
        >
          <MnStepper steps={stepperSteps} currentStep={currentStep} onChange={setCurrentStep} />
        </ComponentDoc>

        {/* Dropdown */}
        <ComponentDoc
          entry={entry('mn-dropdown-menu')}
          props={COMPONENT_PROPS['mn-dropdown-menu']}
          example={`<MnDropdownMenu trigger={<button>Actions</button>}>
  <MnDropdownLabel>Operations</MnDropdownLabel>
  <MnDropdownItem onSelect={handleStart}>Start</MnDropdownItem>
  <MnDropdownSeparator />
  <MnDropdownItem onSelect={handleExport}>Export</MnDropdownItem>
</MnDropdownMenu>`}
        >
          <MnDropdownMenu trigger={<span className="px-3 py-1.5 rounded border text-sm">Actions</span>}>
            <MnDropdownLabel>Plan Operations</MnDropdownLabel>
            <MnDropdownItem onSelect={() => {}}>Start execution</MnDropdownItem>
            <MnDropdownItem onSelect={() => {}}>Pause all agents</MnDropdownItem>
            <MnDropdownSeparator />
            <MnDropdownItem onSelect={() => {}}>Export report</MnDropdownItem>
          </MnDropdownMenu>
        </ComponentDoc>

        {/* Detail Panel */}
        <ComponentDoc
          entry={entry('mn-detail-panel')}
          props={COMPONENT_PROPS['mn-detail-panel']}
          example={`<MnDetailPanel
  open={open}
  onOpenChange={setOpen}
  title="Agent Config"
  editable
  onSave={handleSave}
  sections={[{ title: "General", fields: [...] }]}
/>`}
        >
          <button onClick={() => setDetailOpen(true)} className="px-3 py-1.5 rounded border text-sm">
            Open Detail Panel
          </button>
          <MnDetailPanel
            open={detailOpen}
            onOpenChange={setDetailOpen}
            title="Agent Configuration"
            editable
            onSave={() => setDetailOpen(false)}
            sections={[
              {
                title: 'General',
                fields: [
                  { key: 'name', label: 'Agent Name', type: 'text', value: 'Orchestrator-Prime' },
                  { key: 'model', label: 'Model', type: 'select', value: 'gpt-4o', options: [{ value: 'gpt-4o', label: 'GPT-4o' }, { value: 'claude-3.5', label: 'Claude 3.5' }] },
                  { key: 'active', label: 'Active', type: 'boolean', value: true },
                ],
              },
            ]}
          />
        </ComponentDoc>

        {/* Data Table */}
        <ComponentDoc
          entry={entry('mn-data-table')}
          props={COMPONENT_PROPS['mn-data-table']}
          example={`<MnDataTable
  columns={[
    { key: "name", label: "Agent", sortable: true },
    { key: "status", label: "Status", type: "status" },
  ]}
  data={rows}
  pageSize={5}
/>`}
        >
          <MnDataTable columns={tableColumns} data={tableData} pageSize={5} aria-label="Agent overview" />
        </ComponentDoc>

        {/* Calendar Range */}
        <ComponentDoc
          entry={entry('mn-calendar-range')}
          props={COMPONENT_PROPS['mn-calendar-range']}
          example={`<MnCalendarRange
  value={dateRange}
  onChange={setDateRange}
  startLabel="Sprint start"
  endLabel="Sprint end"
/>`}
        >
          <MnCalendarRange value={dateRange} onChange={setDateRange} startLabel="Sprint start" endLabel="Sprint end" />
        </ComponentDoc>
      </div>
    </section>
  );
}
