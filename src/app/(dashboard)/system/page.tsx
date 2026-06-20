import {
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Server,
  Terminal,
} from "lucide-react";
import { PageHeading } from "@/components/shared/page-heading";
import { StatusPill } from "@/components/shared/status-pill";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatBytes, formatDuration } from "@/lib/format";
import { getSystemOverview } from "@/lib/system";

export default async function SystemInformationPage() {
  const system = await getSystemOverview();

  const detailGroups = [
    {
      title: "Host",
      icon: Server,
      rows: [
        ["Hostname", system.hostname],
        ["Platform", system.platform],
        ["Release", system.release],
        ["Architecture", system.arch],
      ],
    },
    {
      title: "Runtime",
      icon: Terminal,
      rows: [
        ["Node.js", system.nodeVersion],
        ["Environment", system.environment],
        ["Process ID", String(system.pid)],
        ["Started", system.startedAt],
      ],
    },
    {
      title: "Workspace",
      icon: HardDrive,
      rows: [
        ["Root", system.workspaceRoot],
        ["Checked", system.checkedAt],
        ["Uptime", formatDuration(system.uptimeSeconds)],
        ["Status", system.status],
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="System profile"
        title="System Information"
        description="Inspect host, runtime, memory, and service state exposed by server-side Next.js APIs."
        actions={<StatusPill status={system.status} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Memory pressure</CardTitle>
              <MemoryStick className="h-4 w-4 text-primary" />
            </div>
            <CardDescription>
              {formatBytes(system.usedMemory)} of{" "}
              {formatBytes(system.totalMemory)} used.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={system.memoryUsedPercent} />
            <p className="font-mono text-2xl font-semibold">
              {system.memoryUsedPercent.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">CPU</CardTitle>
              <Cpu className="h-4 w-4 text-primary" />
            </div>
            <CardDescription>
              Logical core count and one minute load average.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-mono text-2xl font-semibold">
              {system.cpuCount} cores
            </p>
            <p className="text-sm text-muted-foreground">
              Load {system.loadAverage[0]?.toFixed(2) ?? "0.00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Network services</CardTitle>
              <Network className="h-4 w-4 text-primary" />
            </div>
            <CardDescription>Starter probes for key app surfaces.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {system.services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between text-sm"
              >
                <span>{service.name}</span>
                <Badge
                  variant={service.status === "online" ? "success" : "warning"}
                >
                  {service.latencyMs}ms
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {detailGroups.map((group) => (
          <Card key={group.title}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <group.icon className="h-4 w-4 text-primary" />
                <CardTitle>{group.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.rows.map(([label, value], index) => (
                <div key={label}>
                  {index > 0 ? <Separator className="mb-4" /> : null}
                  <div className="grid gap-1">
                    <span className="text-xs uppercase text-muted-foreground">
                      {label}
                    </span>
                    <span className="break-words font-mono text-sm">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
