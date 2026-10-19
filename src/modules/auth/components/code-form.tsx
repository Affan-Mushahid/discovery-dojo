"use client";
import { useState, type FormEvent } from "react";
import { requestJson } from "@/lib/client-http";
import { ArrowRight, Mail } from "lucide-react";
import { LogoutButton } from "./logout-button";

export function CodeForm() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function send() {
    setBusy(true); setError(""); setMessage("");
    try {
      const data = await requestJson("/api/auth/send-code", "POST");
      setSent(true); setMessage(data.message ?? "Code sent.");
    } catch (err) { setError(err instanceof Error ? err.message : "Try again."); }
    finally { setBusy(false); }
  }
  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = new FormData(event.currentTarget).get("code");
    setBusy(true); setError(""); setMessage("");
    try {
      const data = await requestJson("/api/auth/verify-code", "POST", { code });
      window.location.assign(data.redirect ?? "/profile");
    } catch (err) { setError(err instanceof Error ? err.message : "Try again."); }
    finally { setBusy(false); }
  }
  return <div className="space-y-5">
    <button className={sent ? "secondary-button w-full" : "primary-button w-full"} disabled={busy} onClick={send}><Mail size={17} />{busy ? "Please wait…" : sent ? "Send another code" : "Send my sign-in code"}</button>
    <p className="text-xs leading-5 text-slate-500">Codes expire in 10 minutes. Wait at least 60 seconds between requests. Up to five sends per hour and five verification attempts.</p>
    <form onSubmit={verify} className="space-y-5"><div><label htmlFor="code">Six-digit email code</label><input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} placeholder="000000" className="text-center text-xl tracking-[0.5em]" required /></div><button className="primary-button w-full" disabled={busy}>Verify & continue<ArrowRight size={17} /></button></form>
    {error && <p role="alert" className="notice-error">{error}</p>}{message && <p role="status" className="notice-success">{message}</p>}
    <div className="text-center"><LogoutButton /></div>
  </div>;
}
