# Session handoff

## Status
Work is paused at the user's request. No Phase 4 implementation has been started in this session; the only action taken was creating this handoff file.

## Project context
DiscoveryDojo is a mobile-first Next.js App Router sales-discovery practice application using Supabase. Workspace already includes the foundation, agent guidance/skills, authentication, profiles, and partial simulation modules and routes. The current roadmap marks Phase 4, “Text-first simulation application,” in progress; voice is deferred to Phase 5.

## Phase 4 scope
- Shared solar installer scenario; learner represents a lead-generation agency. Prospect details are revealed progressively, not in the public briefing.
- Persisted text conversations, using OpenRouter's `openrouter/free` provider route with server-side scenario context and validated output.
- Private, evidence-based 100-point evaluation, saved with transcripts and only visible to the owner.
- Dashboard/history with the ability to reopen saved simulations.
- The fifteenth learner response triggers the frustrated prospect response, marks failure, and closes the conversation; save a diagnostic evaluation.

## Important unresolved risks and decisions
- Provider exhaustion behavior must be defined before delivery. Free model availability/quotas are not guaranteed; provide a clear recoverable user experience without losing a submitted turn.
- Database status is uncertain and must be inspected before schema changes. User-reported applied migrations include session-verification storage and login-verification RPCs; domain tables and seed are not confirmed applied. Existing supplied SQL has known inconsistencies: `auth_delivery_keys.id` is boolean in storage but RPC SQL compares it to `'login'`; verification-code column names differ; `public.is_login_verified()` is missing per the reported failure; scenario seed references an absent `company` column. Do not assume pending migrations ran or apply conflicting SQL unchanged.
- The user previously supplied a pause instruction; resume only after the user asks to continue.

## Existing implementation to inspect on resume
Review current repository files, especially `src/modules/conversations/`, `src/modules/evaluations/`, `src/modules/scenarios/`, `src/modules/simulations/service.ts`, simulation API routes, `src/components/simulation-workspace.tsx`, and current README/docs. Call `database_schema` before any database changes and use migrations only through the provided migration workflow.
