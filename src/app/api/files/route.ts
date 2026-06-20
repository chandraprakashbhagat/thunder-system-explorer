import { NextRequest } from "next/server";
import { listDirectory } from "@/lib/files";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const relativePath = request.nextUrl.searchParams.get("path") ?? "";

  try {
    return Response.json(await listDirectory(relativePath));
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to read the requested directory.",
      },
      { status: 400 },
    );
  }
}
