import { AuthShell } from "@/components/auth-shell";
import { AuthForm } from "@/modules/auth/components/auth-form";

export default function SignupPage() {
  return <AuthShell><h2 className="text-[34px] font-semibold leading-tight tracking-tight">Great conversations<br />start here.</h2><p className="mb-9 mt-3 text-sm leading-6 text-slate-500">Create your account. Make room to grow.</p><AuthForm mode="signup" /></AuthShell>;
}
