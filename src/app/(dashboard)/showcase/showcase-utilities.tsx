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
import { stepperSteps } from './showcase-data';

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
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnAvatar</h3>
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
        </div>

        {/* Spinners */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnSpinner</h3>
          <div className="flex items-center gap-4">
            <MnSpinner size="sm" variant="primary" label="Loading" />
            <MnSpinner size="md" variant="muted" label="Processing" />
            <MnSpinner size="lg" variant="destructive" label="Error state" />
          </div>
        </div>

        {/* Toggles */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnToggleSwitch</h3>
          <div className="flex flex-col gap-2">
            <MnToggleSwitch checked={toggleA} onCheckedChange={setToggleA} label="Auto-deploy" />
            <MnToggleSwitch checked={toggleB} onCheckedChange={setToggleB} label="Reduced motion" size="sm" />
          </div>
        </div>

        {/* Stepper */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnStepper</h3>
          <MnStepper steps={stepperSteps} currentStep={currentStep} onChange={setCurrentStep} />
        </div>

        {/* Dropdown */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnDropdownMenu</h3>
          <MnDropdownMenu trigger={<span className="px-3 py-1.5 rounded border text-sm">Actions</span>}>
            <MnDropdownLabel>Plan Operations</MnDropdownLabel>
            <MnDropdownItem onSelect={() => {}}>Start execution</MnDropdownItem>
            <MnDropdownItem onSelect={() => {}}>Pause all agents</MnDropdownItem>
            <MnDropdownSeparator />
            <MnDropdownItem onSelect={() => {}}>Export report</MnDropdownItem>
          </MnDropdownMenu>
        </div>

        {/* Detail Panel */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnDetailPanel</h3>
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
        </div>

        {/* Data Table */}
        <div className="rounded-lg border p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnDataTable</h3>
          <MnDataTable columns={tableColumns} data={tableData} pageSize={5} aria-label="Agent overview" />
        </div>

        {/* Calendar Range */}
        <div className="rounded-lg border p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnCalendarRange</h3>
          <MnCalendarRange value={dateRange} onChange={setDateRange} startLabel="Sprint start" endLabel="Sprint end" />
        </div>
      </div>
    </section>
  );
}
