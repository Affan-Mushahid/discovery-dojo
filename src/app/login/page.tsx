import { AuthShell } from "@/components/auth-shell";
import { AuthForm } from "@/modules/auth/components/auth-form";

export default function LoginPage() {
  return <AuthShell><h2 className="text-[34px] font-semibold leading-tight tracking-tight text-slate-900">Welcome back.</h2><p className="mb-9 mt-3 text-sm leading-6 text-slate-500">Confidence comes with practice.<br />Sign in to take your next step.</p><AuthForm mode="login" /><div className="mt-9 flex items-start gap-2.5 rounded-lg bg-[#f0f4ef] p-3.5 text-xs leading-5 text-slate-500"><span aria-hidden="true" className="text-emerald-700">✧</span><p>A little extra peace of mind. We’ll ask for an email code each time you sign in.</p></div></AuthShell>;
}
