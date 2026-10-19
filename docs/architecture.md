# Architecture and phase boundaries

## Current foundation

The project uses Next.js App Router, TypeScript, Tailwind CSS, and modular boundaries under `src/modules/`. Keep UI in the App Router/presentation layer, provider-independent contracts and use cases in domain modules, and external services behind `src/modules/providers/` adapters. Avoid importing provider SDKs into domain logic.

Phase 3 implements auth/profile forms, contracts, server guards, Supabase persistence and Gmail/PGP adapters. Simulation, evaluation and OpenRouter modules remain placeholders. Database migrations are pending approval, not live. See `docs/auth-setup.md` for provisioning and `docs/reusable-auth.md` for public boundaries. Keep modules focused; route handlers compose domain logic and adapters.

## Product constraints

- Mobile-first text practice for lead-generation services.
- One shared fictional solar-company prospect seeking more leads.
- Learner messages are counted; the fifteenth learner response triggers the frustrated-prospect failure boundary.
- Feedback and history are private to the learner. Scenarios are shared unless a future custom-scenario feature explicitly changes that.
- Voice and speech integrations are deferred; keep future speech adapters decoupled.

## Delivery discipline

Read existing files before editing; make the smallest change that satisfies the active phase. Do not implement deferred features merely because they appear in `SPEC.md`. Use focused tests and the existing lint/typecheck/test scripts when changing application code. Keep migrations versioned, minimal, and safe to rerun; schema changes belong in approved migrations, never ad-hoc SQL execution.
