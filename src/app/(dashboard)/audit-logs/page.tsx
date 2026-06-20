import { AuditLogTable } from "@/components/audit/audit-log-table";
import { PageHeading } from "@/components/shared/page-heading";
import { getAuditLogs } from "@/lib/audit";

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Security trail"
        title="Audit Logs"
        description="Filter starter audit events that represent explorer reads, route checks, and configuration changes."
      />
      <AuditLogTable logs={logs} />
    </div>
  );
}
