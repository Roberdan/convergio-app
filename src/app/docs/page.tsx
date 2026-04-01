import { FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

const DOCS = [
  { title: "Getting Started", description: "Quick start guide for the Convergio platform", href: "#" },
  { title: "Agent Configuration", description: "How to register, configure and monitor agents", href: "#" },
  { title: "Plan Execution", description: "Creating and executing plans with waves and tasks", href: "#" },
  { title: "Mesh Networking", description: "Peer discovery, delegation, and sync protocols", href: "#" },
  { title: "Security Model", description: "ACL, budget gates, egress firewall, audit chain", href: "#" },
  { title: "API Reference", description: "Full HTTP API documentation for the daemon", href: "#" },
];

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <div>
          <h1>Documentation</h1>
          <p className="text-caption mt-1">Guides and references for the platform.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {DOCS.map((doc) => (
          <Link
            key={doc.title}
            href={doc.href}
            className="group flex items-start gap-3 rounded-lg border bg-card p-4 text-card-foreground transition-colors hover:bg-muted"
          >
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium group-hover:text-primary transition-colors">{doc.title}</p>
              <p className="text-micro mt-0.5">{doc.description}</p>
            </div>
            <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
}
