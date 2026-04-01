import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl">Sign in</h1>
          <p className="text-caption mt-1">Enter your credentials to continue.</p>
        </div>
        <div className="grid gap-4 rounded-lg border bg-card p-6 text-card-foreground">
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="h-9 w-full rounded-md border border-border bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              className="h-9 w-full rounded-md border border-border bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button className="w-full">Sign In</Button>
        </div>
        <p className="text-center text-micro">
          No account yet? Contact your administrator.
        </p>
      </div>
    </div>
  );
}
