"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { requestJson } from "@/lib/client-http";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true); setError(""); setMessage("");
    try {
      const result = await requestJson(`/api/auth/${mode}`, "POST", Object.fromEntries(form));
      if (result.redirect) window.location.assign(result.redirect);
      else setMessage(result.message ?? "Done.");
    } catch (err) { setError(err instanceof Error ? err.message : "Try again."); }
    finally { setBusy(false); }
  }
  return <>
    <form onSubmit={submit} className="space-y-5">
      <div><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" maxLength={254} required /></div>
      <div><label htmlFor="password">Password</label><div className="relative"><input id="password" name="password" type={visible ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} maxLength={128} placeholder="At least 8 characters" className="pr-12" required /><button type="button" className="absolute right-1 top-1 grid h-10 w-10 place-items-center text-slate-500" onClick={() => setVisible(!visible)} aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
      {mode === "signup" && <p className="text-xs leading-5 text-slate-500">We’ll send an email to confirm your address. A separate sign-in code keeps every new session protected.</p>}
      {error && <p role="alert" className="notice-error">{error}</p>}
      {message && <p role="status" className="notice-success">{message}</p>}
      <button className="primary-button w-full" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}<ArrowRight size={17} /></button>
    </form>
    <p className="mt-7 text-center text-sm text-slate-500">{mode === "login" ? "New to the dojo? " : "Already have an account? "}<Link className="font-semibold text-emerald-800 hover:underline" href={mode === "login" ? "/signup" : "/login"}>{mode === "login" ? "Create an account" : "Sign in"}</Link></p>
  </>;
}
