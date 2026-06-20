"use client";

import { Menu, RefreshCw, ShieldCheck } from "lucide-react";
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/90 px-4 backdrop-blur sm:px-6 lg:px-8">
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
