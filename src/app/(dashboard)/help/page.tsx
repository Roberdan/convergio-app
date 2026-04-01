import { HelpCircle, MessageCircle, BookOpen, Bug } from "lucide-react";
import Link from "next/link";

const LINKS = [
  { title: "Documentation", description: "Browse guides and API reference", icon: BookOpen, href: "/docs" },
  { title: "Report a Bug", description: "File an issue on GitHub", icon: Bug, href: "#" },
  { title: "Community", description: "Join the discussion", icon: MessageCircle, href: "#" },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <HelpCircle className="h-5 w-5 text-muted-foreground" />
        <div>
          <h1>Help</h1>
          <p className="text-caption mt-1">Resources and support channels.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {LINKS.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="flex flex-col items-center gap-3 rounded-lg border bg-card p-6 text-card-foreground text-center transition-colors hover:bg-muted"
          >
            <link.icon className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{link.title}</p>
              <p className="text-micro mt-1">{link.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
