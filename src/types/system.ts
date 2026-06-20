export type ServiceProbe = {
  name: string;
  status: "online" | "degraded" | "offline";
  latencyMs: number;
  description: string;
};

export type SystemOverview = {
  hostname: string;
  platform: string;
  arch: string;
  release: string;
  uptimeSeconds: number;
  loadAverage: number[];
  cpuCount: number;
  totalMemory: number;
  freeMemory: number;
  usedMemory: number;
  memoryUsedPercent: number;
  nodeVersion: string;
  pid: number;
  environment: string;
  startedAt: string;
  checkedAt: string;
  workspaceRoot: string;
  status: "operational" | "degraded";
  services: ServiceProbe[];
};

export type EnvironmentVariable = {
  key: string;
  category: "public" | "secret" | "system" | "runtime";
  maskedValue: string;
  length: number;
};

export type FileEntry = {
  name: string;
  relativePath: string;
  kind: "file" | "directory";
  size: number;
  modifiedAt: string;
};

export type FileListing = {
  root: string;
  relativePath: string;
  parentPath: string | null;
  entries: FileEntry[];
};

export type AuditLog = {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  resource: string;
  status: "success" | "warning" | "blocked";
  confidence: number;
  ipAddress: string;
};
