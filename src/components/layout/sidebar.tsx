"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  FileClock,
  FolderOpen,
  Gauge,
  LockKeyhole,
  Settings,
  Server,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavigationItem = {
  title: string;
  href: Route;
  icon: LucideIcon;
};

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Gauge,
  },
  {
    title: "System Information",
    href: "/system",
    icon: Server,
  },
  {
    title: "Environment Variables",
    href: "/environment",
    icon: LockKeyhole,
  },
  {
    title: "File Manager",
    href: "/files",
    icon: FolderOpen,
  },
  {
    title: "Audit Logs",
    href: "/audit-logs",
    icon: FileClock,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 flex-col border-r bg-card/95 shadow-sm backdrop-blur",
        className,
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Zap className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            Thunder System Explorer
          </p>
          <p className="text-xs text-muted-foreground">Full-stack starter</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navigationItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground",
                active &&
                  "bg-accent text-accent-foreground shadow-sm ring-1 ring-border",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="rounded-md border bg-secondary/40 p-3">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Explorer mode
          </p>
          <p className="mt-1 text-sm font-semibold">Dark operations</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Server data is read through scoped API routes and masked where
            sensitive.
          </p>
        </div>
      </div>
    </aside>
  );
}
