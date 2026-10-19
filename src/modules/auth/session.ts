import "server-only";
import { createSupabaseServer } from "@/modules/providers/supabase/server";

export class AccessError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
export async function passwordSession() {
  const client = await createSupabaseServer();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user || !user.email_confirmed_at) throw new AccessError("Sign in with a confirmed email first.", 401);
  const { data, error: claimsError } = await client.auth.getClaims();
  const sessionId = data?.claims?.session_id;
  const methods = data?.claims?.amr;
  const usedPassword = Array.isArray(methods) && methods.some(
    (entry: unknown) => typeof entry === "object" && entry !== null && "method" in entry && entry.method === "password",
  );
  if (claimsError || typeof sessionId !== "string" || !usedPassword) throw new AccessError("Sign in with your password again.", 401);
  return { client, user, sessionId };
}
export async function verifiedSession() {
  const session = await passwordSession();
  const { data, error } = await session.client.rpc("is_login_verified");
  if (error) throw new AccessError("Database setup is pending. Approve the required verification and simulation migrations in the Database panel.", 503);
  if (data !== true) throw new AccessError("Verify your email code to continue.", 403);
  return session;
}
