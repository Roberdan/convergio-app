import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { setSessionCookie } from "@/lib/session";
import { resolveLocale } from "@/lib/i18n";

export default function LoginPage() {
  const t = resolveLocale("loginPage");

  async function handleLogin(formData: FormData) {
    "use server";
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const expectedUser = process.env.ADMIN_USERNAME ?? "admin";
    const expectedPass = process.env.ADMIN_PASSWORD ?? "admin";

    if (username === expectedUser && password === expectedPass) {
      await setSessionCookie("authenticated");
      redirect("/");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl">{t.signIn}</h1>
          <p className="text-caption mt-1">{t.enterCredentials}</p>
        </div>
        <form action={handleLogin} className="grid gap-4 rounded-lg border bg-card p-6 text-card-foreground">
          <div className="grid gap-1.5">
            <Label htmlFor="username">{t.username}</Label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder={t.usernamePlaceholder}
              autoComplete="username"
              className="h-9 w-full rounded-md border border-border bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">{t.password}</Label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder={t.passwordPlaceholder}
              autoComplete="current-password"
              className="h-9 w-full rounded-md border border-border bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button type="submit" className="w-full">{t.signInButton}</Button>
        </form>
        <p className="text-center text-micro">
          {t.noAccount}
        </p>
      </div>
    </div>
  );
}
