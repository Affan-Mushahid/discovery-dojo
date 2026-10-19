# DiscoveryDojo

Phase 3 adds mobile-first signup/login, mandatory session-bound email codes and private profile onboarding/editing. Simulation and evaluation workflows remain deferred. `SPEC.md` is the full product reference.

**Setup is pending:** all four submitted database migrations are awaiting approval in the Database panel and have NOT run. Gmail OAuth and an RSA OpenPGP delivery-key pair must also be configured; protected access fails closed until then. See `docs/auth-setup.md` for the approval order, public-key provisioning and security model.

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
src/modules/scenarios/         Scenario boundary (placeholder)
src/modules/conversations/     Conversation boundary (placeholder)
src/modules/evaluations/       Evaluation boundary (placeholder)
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

Unit tests cover validation and challenge orchestration. Playwright smoke tests cover responsive auth forms, anonymous profile protection and cross-origin rejection. Checks were not executed here: the agent has no shell tool. Live Gmail and two-user RLS acceptance checks remain required after configuration; see `docs/auth-setup.md`.

## Deferred

Text simulations, runtime enforcement of the fifteenth-learner-message rule, AI evaluation, saved-results UI and voice remain unimplemented. The pending seed includes the shared solar scenario and private scoring defaults only. No speech SDKs or microphone permissions are included. Later phases will use OpenRouter's free router; availability and quotas must be checked.

Architecture follows the presentation/integration separation reviewed in the
marketplace gig 99 source. Its social-feed features and localStorage token pattern
are not carried over into this App Router foundation.