import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { SetupNotice } from "@/components/setup-notice";
import { AccessError, passwordSession } from "@/modules/auth/session";
import { CodeForm } from "@/modules/auth/components/code-form";

export const dynamic = "force-dynamic";
export default async function VerifyPage() {
  let email: string | undefined;
  let error: unknown;
  let verified = false;
  try {
    const session = await passwordSession();
    email = session.user.email;
    const result = await session.client.rpc("is_login_verified");
    if (result.error) throw new Error("Approve the Phase 3 migrations in the Database panel, then configure Gmail OAuth and the login-code key pair. See docs/auth-setup.md.");
    verified = result.data === true;
  } catch (err) { error = err; }
  if (error instanceof AccessError && error.status === 401) redirect("/login");
  if (error) return <SetupNotice message={error instanceof Error ? error.message : "Authentication setup is unavailable."} />;
  if (verified) redirect("/profile");
  return <AuthShell step="02"><h2 className="text-[34px] font-semibold tracking-tight">A quick security check.</h2><p className="mb-8 mt-3 text-sm leading-6 text-slate-500">Send a code to <strong className="break-all font-medium text-slate-700">{email}</strong>, then enter it below. This protects your new sign-in session.</p><CodeForm /></AuthShell>;
}
