import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, AudioLines, Check, Compass, LockKeyhole, Sprout } from "lucide-react";

export function Brand({ light = false }: { light?: boolean }) {
  return <Link href="/" className={`inline-flex items-center gap-2.5 text-xl font-bold tracking-tight ${light ? "text-white" : "text-slate-900"}`}><span className={`grid h-9 w-9 place-items-center rounded-xl ${light ? "bg-white/10" : "bg-emerald-800 text-white"}`}><AudioLines size={23} /></span>discovery<span className="-ml-2 text-emerald-500">dojo</span><span className="ml-1 rounded border border-current px-1.5 py-0.5 text-[9px] font-medium tracking-widest opacity-50">BETA</span></Link>;
}
export function AuthShell({ children, step = "01" }: { children: ReactNode; step?: string }) {
  return <main className="min-h-svh bg-[#fbfcfa] lg:grid lg:grid-cols-[1fr_1fr]">
    <aside className="relative hidden min-h-svh flex-col overflow-hidden bg-[#102e28] p-12 text-white lg:flex xl:p-16">
      <div className="pointer-events-none absolute -right-52 top-24 h-[600px] w-[600px] rounded-full border border-white/[0.05]" /><div className="pointer-events-none absolute -right-32 top-44 h-[440px] w-[440px] rounded-full border border-white/[0.05]" />
      <Brand light />
      <div className="relative my-auto max-w-lg py-20">
        <p className="mb-7 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />A little practice. A lot of confidence.</p>
        <h1 className="text-5xl font-medium leading-[1.14] tracking-[-0.045em] xl:text-6xl">Better questions.<br />Deeper discovery.<br /><span className="text-[#9cd5ad]">Real confidence.</span></h1>
        <p className="mt-7 max-w-sm text-base leading-7 text-emerald-50/60">Your space to build sales discovery skills—before the conversation that counts.</p>
        <div className="mt-11 space-y-4 text-sm text-emerald-50/80">{["Practice without the pressure", "Build your own discovery style", "Learn one conversation at a time"].map(text => <p key={text} className="flex items-center gap-3"><span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-300/10 text-emerald-300"><Check size={12} /></span>{text}</p>)}</div>
        <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.04] p-5"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-emerald-100/60"><Sprout size={15} />ON THE HORIZON</span><ArrowUpRight size={16} className="text-emerald-100/40" /></div><p className="mt-3 text-sm font-medium">Meet your first prospect: Sunward Solar</p><p className="mt-1 text-xs leading-5 text-emerald-50/50">A solar company. A lead-generation challenge.<br />A chance to ask the right questions. Practice coming next.</p></div>
      </div>
      <p className="relative flex items-center gap-2 text-xs text-white/40"><Compass size={14} />Made for the conversations ahead.</p>
    </aside>
    <section className="flex min-h-svh flex-col px-6 py-7 sm:px-12 lg:px-16 xl:px-24">
      <header className="flex items-center justify-between"><div className="lg:hidden"><Brand /></div><span className="hidden text-xs text-slate-400 lg:block">YOUR NEXT CHAPTER STARTS HERE</span><span className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-500"><LockKeyhole size={12} />Private & secure</span></header>
      <div className="mx-auto my-auto w-full max-w-[390px] py-16"><p className="mb-8 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400"><span className="h-px w-7 bg-emerald-700" />Your dojo · Step {step}</p>{children}</div>
      <footer className="mx-auto flex w-full max-w-[390px] items-center justify-between border-t border-slate-200/80 pt-5 text-[10px] text-slate-400"><span>© {new Date().getFullYear()} DiscoveryDojo</span><span>Small steps. Stronger conversations.</span></footer>
    </section>
  </main>;
}
