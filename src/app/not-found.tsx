import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <p className="font-mono text-6xl font-bold text-muted-foreground">404</p>
      <h2 className="mt-4">Page not found</h2>
      <p className="text-caption mt-1">The page you are looking for does not exist.</p>
      <Button className="mt-6">
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
