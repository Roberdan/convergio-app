'use client';

import { useState } from 'react';
import {
  MnMeshNetwork,
  MnHubSpoke,
  MnDeploymentTable,
  MnAuditLog,
  MnActiveMissions,
  MnNightJobs,
  MnMap,
  MnMeshNetworkCanvas,
  MnMeshNetworkCard,
  MnMeshNetworkToolbar,
  MnSystemStatus,
} from '@/components/maranello';
import type { MeshNode, Service, Incident } from '@/components/maranello';
import {
  meshNodes,
  meshEdges,
  hubSpokeHub,
  hubSpokeSpokes,
  deployments,
  auditEntries,
  missions,
  nightJobs,
} from './showcase-data';

const mapMarkers = [
  { id: 1, lat: 40.7128, lon: -74.006, label: 'New York', detail: 'US-East-1 · 3 nodes', color: 'active' as const },
  { id: 2, lat: 51.5074, lon: -0.1278, label: 'London', detail: 'EU-West-2 · 2 nodes', color: 'active' as const },
  { id: 3, lat: 35.6762, lon: 139.6503, label: 'Tokyo', detail: 'AP-NE-1 · 2 nodes', color: 'warning' as const },
  { id: 4, lat: -33.8688, lon: 151.2093, label: 'Sydney', detail: 'AP-SE-2 · 1 node', color: 'active' as const },
  { id: 5, lat: 1.3521, lon: 103.8198, label: 'Singapore', detail: 'AP-SE-1 · Offline', color: 'danger' as const },
];

const sampleNode: MeshNode = meshNodes[0];

const systemServices: Service[] = [
  { id: 'api', name: 'API Gateway', status: 'operational', uptime: 99.98, latencyMs: 42 },
  { id: 'mesh', name: 'Mesh Orchestrator', status: 'degraded', uptime: 99.2, latencyMs: 180 },
  { id: 'db', name: 'Primary Database', status: 'operational', uptime: 99.99, latencyMs: 8 },
  { id: 'cache', name: 'Redis Cache', status: 'operational', uptime: 100, latencyMs: 2 },
  { id: 'queue', name: 'Message Queue', status: 'operational', uptime: 99.95, latencyMs: 12 },
];

const systemIncidents: Incident[] = [
  { id: 'inc-1', title: 'Mesh node EU-W2 high latency', date: '2025-07-14', severity: 'degraded', resolved: true },
  { id: 'inc-2', title: 'API rate limit misconfiguration', date: '2025-07-12', severity: 'outage', resolved: true },
];

/** Section: W3 Network & Infrastructure components. */
export function ShowcaseNetwork() {
  const [selectedNode, setSelectedNode] = useState<MeshNode | null>(null);

  return (
    <section aria-labelledby="section-network">
      <h2 id="section-network" className="text-lg font-semibold mb-4">
        W3 — Network & Infrastructure
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Map */}
        <div className="rounded-lg border p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnMap</h3>
          <div className="h-80">
            <MnMap markers={mapMarkers} className="h-full rounded-lg" />
          </div>
        </div>

        {/* Mesh Network */}
        <div className="rounded-lg border p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnMeshNetwork</h3>
          <MnMeshNetwork nodes={meshNodes} edges={meshEdges} ariaLabel="Convergio mesh topology" />
        </div>

        {/* Mesh Network Canvas */}
        <div className="rounded-lg border p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnMeshNetworkCanvas</h3>
          <div className="h-64">
            <MnMeshNetworkCanvas
              nodes={meshNodes}
              edges={meshEdges}
              selected={selectedNode?.id ?? null}
              onNodeClick={setSelectedNode}
              ariaLabel="Canvas mesh topology"
              maxParticles={20}
              className="h-full"
            />
          </div>
        </div>

        {/* Mesh Network Toolbar */}
        <div className="rounded-lg border p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnMeshNetworkToolbar</h3>
          <MnMeshNetworkToolbar
            onlineCount={meshNodes.filter(n => n.status === 'online').length}
            totalCount={meshNodes.length}
          />
        </div>

        {/* Mesh Network Card */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnMeshNetworkCard</h3>
          <MnMeshNetworkCard
            node={sampleNode}
            selected={selectedNode?.id === sampleNode.id}
            onSelect={setSelectedNode}
          />
        </div>

        {/* System Status */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnSystemStatus</h3>
          <MnSystemStatus
            services={systemServices}
            incidents={systemIncidents}
            version="v20.8.0"
            environment="production"
          />
        </div>

        {/* Hub & Spoke */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnHubSpoke</h3>
          <MnHubSpoke hub={hubSpokeHub} spokes={hubSpokeSpokes} ariaLabel="Coordinator hub topology" />
        </div>

        {/* Deployment Table */}
        <div className="rounded-lg border p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnDeploymentTable</h3>
          <MnDeploymentTable deployments={deployments} ariaLabel="Node deployment status" />
        </div>

        {/* Audit Log */}
        <div className="rounded-lg border p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnAuditLog</h3>
          <MnAuditLog entries={auditEntries} ariaLabel="Platform audit trail" />
        </div>

        {/* Active Missions */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnActiveMissions</h3>
          <MnActiveMissions missions={missions} ariaLabel="Current mission status" />
        </div>

        {/* Night Jobs */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnNightJobs</h3>
          <MnNightJobs jobs={nightJobs} ariaLabel="Scheduled batch operations" />
        </div>
      </div>
    </section>
  );
}
