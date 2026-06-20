import { EnvironmentTable } from "@/components/environment/environment-table";
import { PageHeading } from "@/components/shared/page-heading";
import { getEnvironmentVariables } from "@/lib/system";

export default async function EnvironmentVariablesPage() {
  const variables = await getEnvironmentVariables();

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Runtime configuration"
        title="Environment Variables"
        description="Review server-side environment keys with values masked by default for safer local exploration."
      />
      <EnvironmentTable variables={variables} />
    </div>
  );
}
