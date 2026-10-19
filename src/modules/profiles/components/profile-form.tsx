"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, Save } from "lucide-react";
import type { Profile } from "../validation";
import { requestJson } from "@/lib/client-http";

export function ProfileForm({ profile, email }: { profile: Profile | null; email: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true); setMessage(""); setError("");
    try {
      const result = await requestJson("/api/profile", "PUT", body);
      setMessage(result.message ?? "Profile saved.");
      router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Try again."); }
    finally { setBusy(false); }
  }
  return <form className="space-y-6" onSubmit={submit}>
    <div><label htmlFor="profile-email">Account email</label><input id="profile-email" type="email" value={email} disabled /><p className="mt-2 text-xs text-slate-500">Your verified sign-in email. Not shared with other learners.</p></div>
    <div><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" defaultValue={profile?.name ?? ""} maxLength={80} placeholder="What should we call you?" required /></div>
    <div className="grid gap-6 sm:grid-cols-[100px_1fr]"><div><label htmlFor="age">Age</label><input id="age" name="age" type="number" min={13} max={120} step={1} defaultValue={profile?.age} placeholder="25" required /></div><div><label htmlFor="company">Company <span className="font-normal text-slate-400">(optional)</span></label><input id="company" name="company" autoComplete="organization" maxLength={120} defaultValue={profile?.company ?? ""} placeholder="Your company or independent" /></div></div>
    {error && <p role="alert" className="notice-error">{error}</p>}{message && <p role="status" className="notice-success flex items-center gap-2"><Check size={16} />{message}</p>}
    <div className="border-t pt-6"><button className="primary-button w-full sm:w-auto" disabled={busy}><Save size={16} />{busy ? "Saving…" : "Save profile"}</button></div>
  </form>;
}
