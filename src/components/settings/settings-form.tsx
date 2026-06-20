"use client";

import { useState } from "react";
import { Save, Shield, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type SettingsState = {
  auditRetentionDays: number;
  fileReadLimit: number;
  maskEnvironmentValues: boolean;
  enableTelemetry: boolean;
  workspaceRoot: string;
};

const defaultSettings: SettingsState = {
  auditRetentionDays: 30,
  fileReadLimit: 250,
  maskEnvironmentValues: true,
  enableTelemetry: false,
  workspaceRoot: ".",
};

export function SettingsForm() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);

  function updateSetting<Key extends keyof SettingsState>(
    key: Key,
    value: SettingsState[Key],
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveSettings() {
    setSaving(true);

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Settings could not be saved.");
      }

      toast.success("Settings saved", {
        description: "Starter preferences were accepted by the API.",
      });
    } catch (error) {
      toast.error("Unable to save settings", {
        description:
          error instanceof Error
            ? error.message
            : "The settings API returned an unexpected response.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <CardTitle>Explorer preferences</CardTitle>
          </div>
          <CardDescription>
            Starter controls for file access, logging, and runtime display.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="workspaceRoot">Workspace root</Label>
            <Input
              id="workspaceRoot"
              value={settings.workspaceRoot}
              onChange={(event) =>
                updateSetting("workspaceRoot", event.target.value)
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="auditRetentionDays">Audit retention days</Label>
              <Input
                id="auditRetentionDays"
                type="number"
                min={1}
                max={365}
                value={settings.auditRetentionDays}
                onChange={(event) =>
                  updateSetting("auditRetentionDays", Number(event.target.value))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fileReadLimit">File read limit</Label>
              <Input
                id="fileReadLimit"
                type="number"
                min={25}
                max={1000}
                value={settings.fileReadLimit}
                onChange={(event) =>
                  updateSetting("fileReadLimit", Number(event.target.value))
                }
              />
            </div>
          </div>
          <Separator />
          <label className="flex items-start justify-between gap-4 rounded-md border bg-secondary/30 p-4">
            <span>
              <span className="block text-sm font-medium">
                Mask environment values
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Keep all variable values hidden in the dashboard.
              </span>
            </span>
            <input
              type="checkbox"
              checked={settings.maskEnvironmentValues}
              onChange={(event) =>
                updateSetting("maskEnvironmentValues", event.target.checked)
              }
              className="mt-1 h-4 w-4 accent-primary"
            />
          </label>
          <label className="flex items-start justify-between gap-4 rounded-md border bg-secondary/30 p-4">
            <span>
              <span className="block text-sm font-medium">
                Enable telemetry sampling
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Reserve a hook for future application analytics.
              </span>
            </span>
            <input
              type="checkbox"
              checked={settings.enableTelemetry}
              onChange={(event) =>
                updateSetting("enableTelemetry", event.target.checked)
              }
              className="mt-1 h-4 w-4 accent-primary"
            />
          </label>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving" : "Save settings"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Safety defaults</CardTitle>
          </div>
          <CardDescription>
            These starter constraints are applied server-side.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            File browsing is scoped to the application workspace and rejects
            parent directory traversal.
          </p>
          <p>
            Environment values are masked before they cross the server and
            client boundary.
          </p>
          <p>
            Settings are currently acknowledged through an API route, ready to
            be connected to a database or configuration store.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
