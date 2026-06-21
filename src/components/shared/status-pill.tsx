import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SystemOverview } from "@/types/system";

export function StatusPill({ status }: { status: SystemOverview["status"] }) {
  return (
    <Badge variant={status === "operational" ? "success" : "warning"}>
      <span className="status-dot mr-2" />
      <Activity className="mr-1 h-3 w-3" />
      {status === "operational" ? "Operational" : "Degraded"}
    </Badge>
  );
}
