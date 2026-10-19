# DiscoveryDojo

Phase 1 only: a modular, mobile-first Next.js foundation. The home route is a
static setup placeholder, not a functioning simulation application. `SPEC.md`
remains the product reference; no database tables or policies have been changed.

## Run

Requires Node 20.9+ and npm.

```sh
npm install
npm run dev
```

Open `http://localhost:3000` (or the preview URL). No credentials are required for
this phase. For later integrations, add values using the workspace **Secrets**
panel; `.env.example` documents the reserved names. Only the Supabase URL and
anonymous key may be public. No service-role credential is needed or requested.

## Structure

```text
src/app/                       App Router shell and global styles
src/components/ui/             Reserved shadcn-compatible UI primitives
src/lib/utils.ts               Shared class-name helper
src/modules/auth/              Authentication boundary (placeholder)
src/modules/scenarios/         Scenario boundary (placeholder)
src/modules/conversations/     Conversation boundary (placeholder)
src/modules/evaluations/       Evaluation boundary (placeholder)
src/modules/providers/         Supabase, OpenRouter, email adapter placeholders
```

Domain modules should own provider-independent contracts and use cases. Future
Route Handlers compose domain logic with adapters; UI remains presentational.
The empty module entry points intentionally export no implemented functionality.
The `@/*` alias maps to `src/*`. Tailwind tokens, `cn`, and `components.json`
prepare the project for shadcn/ui; no component library has been generated yet.

## Development commands

- `npm run lint` — ESLint with Next.js and TypeScript rules.
- `npm run typecheck` — TypeScript validation.
- `npm run build` / `npm start` — production build and server.
- `npm test` / `npm run test:watch` — Vitest, configured for future unit tests.
- `npm run test:e2e` — Playwright, configured for desktop and mobile Chromium.
  Install browsers with `npx playwright install chromium` before future E2E runs.

No test suites are included in this phase. Vitest explicitly permits an empty
suite; Playwright will report no tests until `e2e/` receives tests.

## Deferred

Authentication, signup verification, mandatory codes on every fresh login,
scenario content, the fifteenth-learner-response failure rule, AI evaluation,
saved history, database migrations, and voice are not implemented. A later phase
will use Supabase Auth/RLS, Nodemailer Gmail OAuth2, and OpenRouter's free router;
free-tier availability and quotas must be checked then. Speech SDKs and microphone
permissions are deliberately omitted.

Architecture follows the presentation/integration separation reviewed in the
marketplace gig 99 source. Its social-feed features and localStorage token pattern
are not carried over into this App Router foundation.