import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import type { FileEntry, FileListing } from "@/types/system";

const ignoredNames = new Set([
  ".git",
  ".next",
  ".vercel",
  "node_modules",
  "out",
  "build",
  "dist",
]);

function normalizeRelativePath(relativePath: string) {
  return relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
}

function resolveInsideWorkspace(relativePath: string) {
  const root = process.cwd();
  const normalized = normalizeRelativePath(relativePath);
  const target = path.resolve(root, normalized || ".");
  const rootWithSeparator = root.endsWith(path.sep) ? root : `${root}${path.sep}`;

  if (target !== root && !target.startsWith(rootWithSeparator)) {
    throw new Error("Path escapes the workspace root.");
  }

  return {
    root,
    target,
    normalized,
  };
}

function toPortablePath(root: string, target: string) {
  return path.relative(root, target).replace(/\\/g, "/");
}

export async function listDirectory(relativePath = ""): Promise<FileListing> {
  const { root, target, normalized } = resolveInsideWorkspace(relativePath);
  const stats = await fs.stat(target);

  if (!stats.isDirectory()) {
    throw new Error("The requested path is not a directory.");
  }

  const dirents = await fs.readdir(target, { withFileTypes: true });
  const entries: FileEntry[] = [];

  for (const dirent of dirents) {
    if (ignoredNames.has(dirent.name)) {
      continue;
    }

    const absolutePath = path.join(target, dirent.name);
    const entryStats = await fs.stat(absolutePath);
    const entryRelativePath = toPortablePath(root, absolutePath);

    entries.push({
      name: dirent.name,
      relativePath: entryRelativePath,
      kind: dirent.isDirectory() ? "directory" : "file",
      size: entryStats.size,
      modifiedAt: entryStats.mtime.toISOString(),
    });
  }

  entries.sort((a, b) => {
    if (a.kind !== b.kind) {
      return a.kind === "directory" ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });

  const parentPath = normalized
    ? toPortablePath(root, path.dirname(target))
    : null;

  return {
    root,
    relativePath: normalized,
    parentPath: parentPath === "." ? "" : parentPath,
    entries,
  };
}
