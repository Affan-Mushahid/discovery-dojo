# DiscoveryDojo agent guide

DiscoveryDojo is a mobile-first Next.js App Router project for practicing text-first sales discovery. The current prospect is a fictional solar company seeking more leads. Keep domain logic and provider integrations decoupled; do not expose private scenario evidence or learner data.

This repository is being built in phases. Implement only the active request; do not infer that planned features are already present. Before changing dependencies, schema, or architecture, inspect the existing files and preserve the Phase 1 structure. Never add credentials or `.env` files.

## References

- `docs/architecture.md` — module boundaries and phase scope.
- `docs/security-data.md` — secrets, Supabase, and private user data.
- `docs/skills.md` — reusable skills, provenance, and upstream installation workflow.
- `.agents/skills/` — project-local reusable skill instructions.

Use the applicable skill before substantial UI, React, or interaction work. Keep changes focused, mobile-first, typed, and testable. Update documentation only when the behavior or project workflow changes.
