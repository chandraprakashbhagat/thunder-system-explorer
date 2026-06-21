"use client";

import { Menu, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { StatusPill } from "@/components/shared/status-pill";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatBytes, formatDuration } from "@/lib/format";
import type { SystemOverview } from "@/types/system";

export function Topbar({
  onMenuClick,
  system,
}: {
  onMenuClick: () => void;
  system: SystemOverview;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/70 bg-background/70 px-4 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">
            {system.hostname}
          </p>
          <p className="truncate font-mono text-xs text-muted-foreground">
            uptime {formatDuration(system.uptimeSeconds)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden w-72 xl:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <div className="h-9 rounded-md border border-input bg-background/60 py-2 pl-9 pr-3 text-xs text-muted-foreground shadow-sm backdrop-blur">
            Search systems, files, logs
          </div>
        </div>
        <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>{formatBytes(system.freeMemory)} free</span>
        </div>
        <Separator orientation="vertical" className="hidden h-6 md:block" />
        <StatusPill status={system.status} />
        <Button
          variant="outline"
          size="icon"
          aria-label="Refresh current page"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
