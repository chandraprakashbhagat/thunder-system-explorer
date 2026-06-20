"use client";

import { useMemo, useState } from "react";
import {
  ChevronRight,
  Clipboard,
  File,
  Folder,
  FolderOpen,
  Loader2,
  Search,
  Undo2,
} from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBytes, formatDateTime } from "@/lib/format";
import type { FileListing } from "@/types/system";

export function FileManager({
  initialListing,
}: {
  initialListing: FileListing;
}) {
  const [listing, setListing] = useState(initialListing);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return listing.entries;
    }

    return listing.entries.filter((entry) =>
      [entry.name, entry.relativePath, entry.kind]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [listing.entries, query]);

  async function openDirectory(relativePath: string) {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/files?path=${encodeURIComponent(relativePath)}`,
      );

      if (!response.ok) {
        throw new Error("The directory could not be loaded.");
      }

      const nextListing = (await response.json()) as FileListing;
      setListing(nextListing);
      setQuery("");
    } catch (error) {
      toast.error("File manager error", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to open the selected directory.",
      });
    } finally {
      setLoading(false);
    }
  }

  function goUp() {
    if (!listing.parentPath) {
      return;
    }

    void openDirectory(listing.parentPath);
  }

  async function copyPath(relativePath: string) {
    await navigator.clipboard.writeText(relativePath || ".");
    toast.success("Path copied", {
      description: relativePath || ".",
    });
  }

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Workspace root
            </CardTitle>
            <CardDescription className="break-all font-mono">
              {listing.relativePath || "."}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search files"
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              onClick={goUp}
              disabled={!listing.parentPath || loading}
            >
              <Undo2 className="mr-2 h-4 w-4" />
              Up
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length ? (
                filtered.map((entry) => (
                  <TableRow key={entry.relativePath}>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-2">
                        {entry.kind === "directory" ? (
                          <Folder className="h-4 w-4 shrink-0 text-primary" />
                        ) : (
                          <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        {entry.kind === "directory" ? (
                          <button
                            type="button"
                            onClick={() => openDirectory(entry.relativePath)}
                            className="truncate text-left text-sm font-medium hover:text-primary"
                          >
                            {entry.name}
                          </button>
                        ) : (
                          <span className="truncate text-sm font-medium">
                            {entry.name}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{entry.kind}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {entry.kind === "directory"
                        ? "-"
                        : formatBytes(entry.size)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {formatDateTime(entry.modifiedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Copy ${entry.name} path`}
                          onClick={() => copyPath(entry.relativePath)}
                        >
                          <Clipboard className="h-4 w-4" />
                        </Button>
                        {entry.kind === "directory" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Open ${entry.name}`}
                            onClick={() => openDirectory(entry.relativePath)}
                          >
                            {loading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-28 text-center text-muted-foreground"
                  >
                    No files match the current filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
