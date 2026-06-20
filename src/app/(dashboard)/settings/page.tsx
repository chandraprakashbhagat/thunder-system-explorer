import { SettingsForm } from "@/components/settings/settings-form";
import { PageHeading } from "@/components/shared/page-heading";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Control plane"
        title="Settings"
        description="Tune starter preferences for telemetry, audit retention, file visibility, and dashboard behavior."
      />
      <SettingsForm />
    </div>
  );
}
