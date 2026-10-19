import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AccessError } from "@/modules/auth/session";

export function assertSameOrigin(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    throw new AccessError("This request must come from this application.", 403);
  }
}
export async function readBody(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new AccessError("Expected JSON.", 415);
  const text = await request.text();
  if (text.length > 4096) throw new AccessError("Request is too large.", 413);
  try { return JSON.parse(text); } catch { throw new AccessError("Invalid JSON.", 400); }
}
export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store" } });
}
export function apiError(error: unknown) {
  if (error instanceof ZodError) return json({ error: error.issues[0]?.message ?? "Invalid input." }, 400);
  if (error instanceof AccessError) return json({ error: error.message }, error.status);
  return json({ error: error instanceof Error ? error.message : "Something went wrong. Try again." }, 503);
}
