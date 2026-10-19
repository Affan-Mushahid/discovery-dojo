import Link from "next/link";

export function SetupNotice({ message }: { message: string }) {
  return <main className="grid min-h-svh place-items-center bg-[#fbfcfa] p-6"><section className="w-full max-w-lg rounded-2xl border bg-white p-8"><p className="mb-4 text-xs font-semibold uppercase tracking-widest text-emerald-800">DiscoveryDojo · Setup</p><h1 className="text-2xl font-semibold">One more setup step.</h1><p role="status" className="my-5 text-sm leading-7 text-slate-600">{message}</p><p className="mb-5 text-xs leading-6 text-slate-500">Protected access stays locked until setup is complete. No email-code bypass is enabled.</p><Link href="/login" className="font-medium text-emerald-800 underline">Back to sign in</Link></section></main>;
}
