export default function HomePage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-5 py-12 sm:px-8">
      <section aria-labelledby="foundation-heading" className="w-full max-w-xl">
        <p className="mb-6 text-sm font-semibold tracking-wide text-primary">
          DiscoveryDojo
        </p>
        <div className="rounded-lg border bg-card p-6 shadow-sm sm:p-10">
          <p className="mb-4 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            Phase 1 · Project foundation
          </p>
          <h1 id="foundation-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready for the next step.
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The modular Next.js workspace is set up. Sales discovery practice
            will be built here in the next phase.
          </p>
          <p className="mt-6 border-t pt-5 text-sm leading-relaxed text-muted-foreground">
            This is a setup placeholder, not the application. Authentication,
            simulations, evaluations, and provider integrations are not yet implemented.
          </p>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          TypeScript · Next.js App Router · Tailwind CSS
        </p>
      </section>
    </main>
  );
}
