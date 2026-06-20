"use client";

import { useMemo, useState } from "react";
import { Check, Clipboard, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { EnvironmentVariable } from "@/types/system";

export function EnvironmentTable({
  variables,
}: {
  variables: EnvironmentVariable[];
}) {
  const [query, setQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return variables;
    }

    return variables.filter((variable) =>
      [variable.key, variable.category, variable.maskedValue]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query, variables]);

  async function copyKey(key: string) {
    await navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success("Environment key copied", {
      description: key,
    });
    window.setTimeout(() => setCopiedKey(null), 1600);
  }

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Variables</CardTitle>
            <CardDescription>
              {variables.length} keys found. Values are intentionally masked.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search variables"
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Masked value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map((variable) => (
                <TableRow key={variable.key}>
                  <TableCell className="font-mono text-xs">
                    {variable.key}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{variable.category}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {variable.maskedValue}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Copy ${variable.key}`}
                      onClick={() => copyKey(variable.key)}
                    >
                      {copiedKey === variable.key ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Clipboard className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-28 text-center text-muted-foreground"
                >
                  No variables match the current filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
