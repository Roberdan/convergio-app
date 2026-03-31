import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Activity,
  Shield,
  Users,
  Bell,
  FileText,
} from "lucide-react";
import type { NavSection } from "@/components/shell/sidebar";

export const defaultNavSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/", icon: LayoutDashboard },
      { id: "projects", label: "Projects", href: "/projects", icon: FolderKanban },
      { id: "activity", label: "Activity", href: "/activity", icon: Activity },
    ],
  },
  {
    label: "Operations",
    items: [
      { id: "agents", label: "Agents", href: "/agents", icon: Users, badge: 12 },
      { id: "security", label: "Security", href: "/security", icon: Shield },
      { id: "notifications", label: "Notifications", href: "/notifications", icon: Bell, badge: 3 },
    ],
  },
  {
    label: "System",
    items: [
      { id: "settings", label: "Settings", href: "/settings", icon: Settings },
      { id: "docs", label: "Documentation", href: "/docs", icon: FileText },
    ],
  },
];
