import { getSystemOverview } from "@/lib/system";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(await getSystemOverview());
}
