# DiscoveryDojo

Phase 4 adds the shared solar discovery scenario, persistent text simulations, private evidence-based evaluations and saved history. `SPEC.md` is the full product reference.

**Setup is pending:** required database migrations for login verification and simulations are awaiting approval in the Database panel and have NOT run. Gmail OAuth and an RSA OpenPGP delivery-key pair are required for protected access; add `OPENROUTER_API_KEY` to Secrets for prospect replies and evaluations. The free model router may be rate-limited or unavailable; retries are shown without assuming free unlimited service. See `docs/auth-setup.md` for email verification configuration.

## Run

Requires Node 20.9+ and npm.

```sh
npm install
npm run dev
```

Open `http://localhost:3000` (or the preview URL). The public login/signup pages render without credentials; real sign-in and profiles require the setup above. Add configuration using the workspace **Secrets** panel; `.env.example` lists names. Only the Supabase URL and anon key may be public. No service-role key is needed.

## Structure

```text
src/app/                       App Router shell and global styles
src/components/ui/             Reserved shadcn-compatible UI primitives
src/lib/utils.ts               Shared class-name helper
src/modules/auth/              Auth contracts, forms, validation and session guards
src/modules/profiles/          Minimal private profile form, validation and persistence
src/modules/scenarios/         Shared solar prospect, hidden facts and rubric
src/modules/conversations/     Validated text turns and transcript persistence
src/modules/evaluations/       Evidence-based private scoring and rubric validation
src/modules/simulations/      Session orchestration and turn-limit enforcement
src/components/simulation-workspace.tsx  Mobile-first conversation and feedback UI
src/modules/providers/         Server Supabase/email adapters; OpenRouter placeholder
```

Domain modules own provider-independent contracts and use cases. Route Handlers compose domain logic with adapters; UI remains presentational. See `docs/reusable-auth.md` for extraction boundaries and marketplace-source provenance.
The `@/*` alias maps to `src/*`. Tailwind tokens, `cn`, and `components.json`
prepare the project for shadcn/ui; no component library has been generated yet.

## Agent guidance and reusable skills

`AGENT.md` is the concise repository guide and links to focused references in `docs/`. Project-local skills are available under `.agents/skills/` for React/Next.js work, mobile-first interface design, and interaction design. They are project-authored checklists; upstream skill collections were requested from `vercel-labs/agent-skills` and `emilkowalski/skill` but could not be installed in this workspace because no terminal/network command tool is available. See `docs/skills.md` for the reviewed CLI workflow to install and inspect those upstream skills in a network-enabled terminal.

## Development commands

- `npm run lint` — ESLint with Next.js and TypeScript rules.
- `npm run typecheck` — TypeScript validation.
- `npm run build` / `npm start` — production build and server.
- `npm test` / `npm run test:watch` — Vitest, configured for future unit tests.
- `npm run test:e2e` — Playwright, configured for desktop and mobile Chromium.
  Install browsers with `npx playwright install chromium` before future E2E runs.

Unit tests cover input validation (including age type coercion), exact session-proof envelopes and challenge orchestration. Playwright smoke tests cover responsive auth forms, anonymous profile protection and cross-origin rejection. Checks were not executed here: the agent has no shell tool. Live Gmail and two-user RLS acceptance checks remain required after configuration; see `docs/auth-setup.md`.

## Simulation behavior

The shared solar scenario's public briefing hides the funnel, follow-up and budget facts until discovered naturally. Conversations use `openrouter/free`, with factual context and transcript supplied server-side. The fifteenth learner message receives a frustrated prospect response, fails the simulation and triggers diagnostic evaluation. Ending earlier produces a normal completed evaluation. History and evaluations are owner-only through user-scoped queries and RLS. Voice and microphone access remain deferred. OpenRouter free availability/quotas are not guaranteed; a generation failure reports a retryable issue and does not silently substitute a paid model.

Architecture follows the presentation/integration separation reviewed in the
marketplace gig 99 source. Its social-feed features and localStorage token pattern
are not carried over into this App Router foundation.