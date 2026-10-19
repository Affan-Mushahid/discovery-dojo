"use client";
import { useState } from "react";
import { requestJson } from "@/lib/client-http";

export function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <><button className="min-h-11 text-sm font-medium text-slate-500 hover:text-slate-900" disabled={busy} onClick={async () => {
    setBusy(true); setError("");
    try { await requestJson("/api/auth/logout", "POST"); window.location.assign("/login"); }
    catch (err) { setError(err instanceof Error ? err.message : "Logout failed."); }
    finally { setBusy(false); }
  }}>{busy ? "Signing out…" : "Sign out"}</button>{error && <p role="alert" className="notice-error">{error}</p>}</>;
}
