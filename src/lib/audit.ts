import "server-only";
import type { AuditLog } from "@/types/system";

const starterEvents = [
  {
    action: "System snapshot read",
    actor: "local-admin",
    resource: "/api/system",
    status: "success",
    confidence: 0.98,
  },
  {
    action: "Environment inventory masked",
    actor: "runtime",
    resource: "/api/environment",
    status: "success",
    confidence: 0.97,
  },
  {
    action: "Workspace directory listed",
    actor: "local-admin",
    resource: "/api/files",
    status: "success",
    confidence: 0.93,
  },
  {
    action: "Settings update accepted",
    actor: "local-admin",
    resource: "/api/settings",
    status: "success",
    confidence: 0.91,
  },
  {
    action: "Traversal attempt blocked",
    actor: "unknown",
    resource: "../",
    status: "blocked",
    confidence: 0.99,
  },
  {
    action: "Audit stream sampled",
    actor: "runtime",
    resource: "/api/audit-logs",
    status: "warning",
    confidence: 0.86,
  },
] satisfies Array<Omit<AuditLog, "id" | "timestamp" | "ipAddress">>;

export async function getAuditLogs(): Promise<AuditLog[]> {
  const now = Date.now();

  return starterEvents.map((event, index) => ({
    id: `evt_${String(index + 1).padStart(4, "0")}`,
    timestamp: new Date(now - index * 1000 * 60 * 12).toISOString(),
    ipAddress: index === 4 ? "0.0.0.0" : "127.0.0.1",
    ...event,
  }));
}
