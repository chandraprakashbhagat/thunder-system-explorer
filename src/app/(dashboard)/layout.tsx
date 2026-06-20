import { AppShell } from "@/components/layout/app-shell";
import { getSystemOverview } from "@/lib/system";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const system = await getSystemOverview();

  return <AppShell system={system}>{children}</AppShell>;
}
