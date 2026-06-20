import { getAuditLogs } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET() {
  const logs = await getAuditLogs();

  return Response.json({
    count: logs.length,
    logs,
  });
}
