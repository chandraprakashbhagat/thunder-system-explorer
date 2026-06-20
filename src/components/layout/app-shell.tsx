"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { SystemOverview } from "@/types/system";

export function AppShell({
  children,
  system,
}: {
  children: React.ReactNode;
  system: SystemOverview;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar className="hidden lg:flex" onNavigate={() => setMobileOpen(false)} />

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <Sidebar
            className="relative flex h-full w-72 max-w-[85vw]"
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      ) : null}

      <div className="lg:pl-72">
        <Topbar system={system} onMenuClick={() => setMobileOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
