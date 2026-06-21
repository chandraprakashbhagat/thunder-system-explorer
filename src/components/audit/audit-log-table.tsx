"use client";

import { useMemo, useState } from "react";
import { ListFilter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatPercent } from "@/lib/format";
import type { AuditLog } from "@/types/system";

const statusOptions = ["all", "success", "warning", "blocked"] as const;

export function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] =
    useState<(typeof statusOptions)[number]>("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesStatus = status === "all" || log.status === status;
      const matchesQuery =
        !normalized ||
        [log.action, log.actor, log.resource, log.ipAddress, log.status]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      return matchesStatus && matchesQuery;
    });
  }, [logs, query, status]);

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <CardTitle>Events</CardTitle>
            <CardDescription>
              {filtered.length} of {logs.length} events visible.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search events"
                className="pl-9"
              />
            </div>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as (typeof statusOptions)[number])
              }
              className="h-10 rounded-md border border-input bg-background/70 px-3 text-sm capitalize shadow-sm outline-none ring-offset-background backdrop-blur transition-all focus:border-primary/50 focus:ring-2 focus:ring-ring"
              aria-label="Filter by status"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Confidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatDateTime(log.timestamp)}
                  </TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.actor}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.resource}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.status === "success"
                          ? "success"
                          : log.status === "warning"
                            ? "warning"
                            : "destructive"
                      }
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatPercent(log.confidence)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  <div className="empty-state">
                    <div className="space-y-2">
                      <ListFilter className="mx-auto h-5 w-5 text-primary" />
                      <p className="text-sm font-medium text-foreground">
                        No audit events found
                      </p>
                      <p className="text-xs">
                        Broaden the search term or status filter.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
