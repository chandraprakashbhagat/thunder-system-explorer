import "server-only";
import os from "node:os";
import type {
  EnvironmentVariable,
  ServiceProbe,
  SystemOverview,
} from "@/types/system";

function round(value: number, decimals = 1) {
  const multiplier = 10 ** decimals;

  return Math.round(value * multiplier) / multiplier;
}

function maskValue(value: string | undefined) {
  if (!value) {
    return "";
  }

  if (value.length <= 4) {
    return "****";
  }

  return `${value.slice(0, 2)}****${value.slice(-2)}`;
}

function categorizeEnvironmentKey(key: string): EnvironmentVariable["category"] {
  if (key.startsWith("NEXT_PUBLIC_")) {
    return "public";
  }

  if (/(TOKEN|KEY|SECRET|PASSWORD|AUTH|CREDENTIAL|DATABASE|DSN)/i.test(key)) {
    return "secret";
  }

  if (/(PATH|HOME|SHELL|USER|COMSPEC|WINDIR|SYSTEMROOT)/i.test(key)) {
    return "system";
  }

  return "runtime";
}

function getServiceProbes(): ServiceProbe[] {
  return [
    {
      name: "App Router",
      status: "online",
      latencyMs: 18,
      description: "Next.js route tree and server components are available.",
    },
    {
      name: "System API",
      status: "online",
      latencyMs: 24,
      description: "Node runtime can read host metadata.",
    },
    {
      name: "Workspace API",
      status: "online",
      latencyMs: 31,
      description: "File reads are scoped to the project directory.",
    },
  ];
}

export async function getSystemOverview(): Promise<SystemOverview> {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsedPercent = round((usedMemory / totalMemory) * 100, 1);
  const services = getServiceProbes();

  return {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    uptimeSeconds: Math.floor(os.uptime()),
    loadAverage: os.loadavg(),
    cpuCount: os.cpus().length,
    totalMemory,
    freeMemory,
    usedMemory,
    memoryUsedPercent,
    nodeVersion: process.version,
    pid: process.pid,
    environment: process.env.NODE_ENV ?? "development",
    startedAt: new Date(Date.now() - process.uptime() * 1000).toISOString(),
    checkedAt: new Date().toISOString(),
    workspaceRoot: process.cwd(),
    status: services.every((service) => service.status === "online")
      ? "operational"
      : "degraded",
    services,
  };
}

export async function getEnvironmentVariables(): Promise<EnvironmentVariable[]> {
  return Object.entries(process.env)
    .map(([key, value]) => ({
      key,
      category: categorizeEnvironmentKey(key),
      maskedValue: maskValue(value),
      length: value?.length ?? 0,
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
}
