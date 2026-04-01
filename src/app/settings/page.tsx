import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-caption mt-1">Manage your account and application preferences.</p>
      </div>

      <section className="space-y-3">
        <h3>Profile</h3>
        <div className="grid gap-4 rounded-lg border bg-card p-5 text-card-foreground">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Display Name</Label>
            <Input id="name" defaultValue="Roberto D'Angelo" className="bg-background" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="roberto@convergio.dev" className="bg-background" />
          </div>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-3">
        <h3>Preferences</h3>
        <div className="space-y-0 rounded-lg border bg-card text-card-foreground divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Desktop notifications</p>
              <p className="text-micro">Receive alerts for plan completions and failures.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Reduced motion</p>
              <p className="text-micro">Minimize animations throughout the interface.</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Compact density</p>
              <p className="text-micro">Reduce spacing for more information on screen.</p>
            </div>
            <Switch />
          </div>
        </div>
      </section>
    </div>
  );
}
