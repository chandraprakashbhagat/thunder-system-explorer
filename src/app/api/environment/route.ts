import { getEnvironmentVariables } from "@/lib/system";

export const runtime = "nodejs";

export async function GET() {
  const variables = await getEnvironmentVariables();

  return Response.json({
    count: variables.length,
    variables,
  });
}
