import { Button } from "@/components/ui/button";
import { FolderKanban, Plus } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1>Projects</h1>
          <p className="text-caption mt-1">Manage your workspaces and repositories.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-16 text-card-foreground">
        <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-center">No projects yet</h3>
        <p className="text-caption text-center mt-1 max-w-sm">
          Create your first project to start organizing plans, agents and workspaces.
        </p>
        <Button className="mt-6">
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>
    </div>
  );
}
