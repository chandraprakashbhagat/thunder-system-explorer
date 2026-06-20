import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const payload = await request.json();

  return Response.json({
    saved: true,
    savedAt: new Date().toISOString(),
    settings: payload,
  });
}
