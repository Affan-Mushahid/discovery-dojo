import { redirect } from "next/navigation";
import { LockKeyhole, UserRound, Check, Sprout } from "lucide-react";
import { Brand } from "@/components/auth-shell";
import { SetupNotice } from "@/components/setup-notice";
import { AccessError, verifiedSession } from "@/modules/auth/session";
import { LogoutButton } from "@/modules/auth/components/logout-button";
import { loadProfile } from "@/modules/profiles/repository";
import { ProfileForm } from "@/modules/profiles/components/profile-form";

export const dynamic = "force-dynamic";
export default async function ProfilePage() {
  let content;
  let failure: unknown;
  try {
    const { client, user } = await verifiedSession();
    const profile = await loadProfile(client, user.id);
    content = { profile, email: user.email ?? "" };
  } catch (error) { failure = error; }
  if (failure instanceof AccessError && failure.status === 401) redirect("/login");
  if (failure instanceof AccessError && failure.status === 403) redirect("/verify");
  if (!content) return <SetupNotice message={failure instanceof Error ? failure.message : "Profile setup is unavailable."} />;
  return <main className="min-h-svh bg-[#f6f8f5]">
    <header className="border-b bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"><Brand /><LogoutButton /></div></header>
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-16"><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">Your space</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{content.profile ? "Make yourself at home." : "First, a little about you."}</h1><p className="mt-3 text-sm leading-6 text-slate-500">A simple profile. A personal starting point.</p>
      <div className="mt-8 grid items-start gap-6 md:grid-cols-[1fr_240px]"><section className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8"><h2 className="mb-7 flex items-center gap-2 text-base font-semibold"><UserRound size={18} className="text-emerald-800" />Your profile</h2><ProfileForm {...content} /></section><aside className="space-y-5"><div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5"><p className="flex items-center gap-2 text-sm font-medium text-emerald-900"><Check size={16} />You’re securely signed in</p><p className="mt-2 text-xs leading-6 text-emerald-900/70">Your email code was verified for this session. Your profile is visible only to you.</p></div><div className="rounded-xl border p-5"><Sprout size={22} className="mb-3 text-emerald-800" /><h2 className="text-sm font-semibold">Practice is coming next</h2><p className="mt-2 text-xs leading-6 text-slate-500">Your account is ready. Text simulations and feedback are being built in the next phase.</p></div></aside></div>
      <p className="mt-7 flex items-center gap-2 text-xs text-slate-400"><LockKeyhole size={13} />Your details stay private. Always yours.</p>
    </div>
  </main>;
}
