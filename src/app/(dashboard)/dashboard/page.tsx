import Link from "next/link";
import type { Route } from "next";
import {
  Activity,
  ArrowUpRight,
  Cpu,
  Database,
  FileClock,
  FolderOpen,
  Gauge,
  LockKeyhole,
  Server,
} from "lucide-react";
import { PageHeading } from "@/components/shared/page-heading";
import { StatusPill } from "@/components/shared/status-pill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAuditLogs } from "@/lib/audit";
import { formatBytes, formatDuration, formatPercent } from "@/lib/format";
import { listDirectory } from "@/lib/files";
import { getEnvironmentVariables, getSystemOverview } from "@/lib/system";
import type { LucideIcon } from "lucide-react";

type SummaryCard = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  href: Route;
};

export default async function DashboardPage() {
  const [system, variables, listing, logs] = await Promise.all([
    getSystemOverview(),
    getEnvironmentVariables(),
    listDirectory(""),
    getAuditLogs(),
  ]);

  const summaryCards: SummaryCard[] = [
    {
      title: "System status",
      value: system.status === "operational" ? "Operational" : "Degraded",
      description: `${system.services.length} monitored services`,
      icon: Activity,
      href: "/system",
    },
    {
      title: "CPU cores",
      value: String(system.cpuCount),
      description: `${system.arch} architecture`,
      icon: Cpu,
      href: "/system",
    },
    {
      title: "Environment",
      value: String(variables.length),
      description: "Masked variables detected",
      icon: LockKeyhole,
      href: "/environment",
    },
    {
      title: "Workspace files",
      value: String(listing.entries.length),
      description: "Root entries available",
      icon: FolderOpen,
      href: "/files",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Command center"
        title="Dashboard"
        description="A live starter surface for local system metadata, workspace visibility, and operational activity."
        actions={
          <Button asChild>
            <Link href="/system">
              Inspect system
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <Card key={item.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-semibold tracking-tight">
                {item.value}
              </div>
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>{item.description}</span>
                <Button asChild variant="ghost" size="icon">
                  <Link href={item.href} aria-label={`Open ${item.title}`}>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Resource profile</CardTitle>
                <CardDescription>
                  Current host health, memory pressure, and runtime context.
                </CardDescription>
              </div>
              <StatusPill status={system.status} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Gauge className="h-4 w-4 text-primary" />
                Memory
              </div>
              <Progress value={system.memoryUsedPercent} />
              <p className="text-xs text-muted-foreground">
                {formatBytes(system.usedMemory)} used of{" "}
                {formatBytes(system.totalMemory)}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Server className="h-4 w-4 text-primary" />
                Runtime
              </div>
              <p className="font-mono text-lg">{system.nodeVersion}</p>
              <p className="text-xs text-muted-foreground">
                PID {system.pid} in {system.environment}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Database className="h-4 w-4 text-primary" />
                Load average
              </div>
              <p className="whitespace-nowrap font-mono text-base font-semibold">
                {system.loadAverage.map((value) => value.toFixed(2)).join(" / ")}
              </p>
              <p className="text-xs text-muted-foreground">
                Uptime {formatDuration(system.uptimeSeconds)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service map</CardTitle>
            <CardDescription>
              Starter checks that can be replaced with real probes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {system.services.map((service) => (
              <div
                key={service.name}
                className="flex items-start justify-between gap-4 rounded-md border bg-secondary/30 p-3"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{service.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {service.description}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      service.status === "online" ? "success" : "secondary"
                    }
                  >
                    {service.status}
                  </Badge>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {service.latencyMs}ms
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Recent audit activity</CardTitle>
            <CardDescription>
              Latest explorer events and starter security signals.
            </CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/audit-logs">
              <FileClock className="mr-2 h-4 w-4" />
              View logs
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.slice(0, 5).map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="font-medium">{log.action}</div>
                    <div className="text-xs text-muted-foreground">
                      {log.resource}
                    </div>
                  </TableCell>
                  <TableCell>{log.actor}</TableCell>
                  <TableCell>
                    <Badge
                      variant={log.status === "success" ? "success" : "warning"}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatPercent(log.confidence)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
