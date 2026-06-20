"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground">
        <main className="flex min-h-screen items-center justify-center p-6">
          <div className="max-w-md space-y-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-semibold">Explorer crashed</h1>
            <p className="text-sm leading-6 text-muted-foreground">
              A root-level error interrupted the application shell.
            </p>
            <Button onClick={() => reset()}>Try again</Button>
          </div>
        </main>
      </body>
    </html>
  );
}
