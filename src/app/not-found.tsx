import { Button } from "@/components/ui/button";
import Link from "next/link";
import { resolveLocale } from "@/lib/i18n";

export default function NotFound() {
  const t = resolveLocale("notFound");

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <p className="font-mono text-6xl font-bold text-muted-foreground">404</p>
      <h2 className="mt-4">{t.pageNotFound}</h2>
      <p className="text-caption mt-1">{t.pageNotFoundDescription}</p>
      <Button className="mt-6">
        <Link href="/">{t.backToDashboard}</Link>
      </Button>
    </div>
  );
}
