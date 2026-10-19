# Security and data conventions

- Keep server credentials in environment variables; never commit credentials, tokens, or `.env` files. Public browser configuration is limited to explicitly safe values such as Supabase URL and anon key.
- Supabase access must be performed as the signed-in user. Every new user-owned table needs `user_id` tied to `auth.users`, RLS enabled, and least-privilege policies for each required operation. Never use a service-role key in browser code.
- Treat transcripts, evaluations, verification data, and hidden prospect evidence as private. Validate client input at server boundaries and do not trust client-supplied ownership or scores.
- Use Supabase Auth and its session behavior for authentication. Signup email confirmation and the product's planned fresh-login code verification are distinct requirements; do not claim either is implemented unless it is.
- Avoid logging secrets, verification codes, or private transcripts. Missing configuration should produce a clear actionable error, not a crash or a silent insecure fallback.

Phase 3 inspected the empty schema and submitted five migrations; all are pending Database-panel approval. No table is live yet. See `docs/auth-setup.md` for the session-bound, database-enforced custom gate, encryption-key provisioning and release checks. Future schema changes must still use the approved migration workflow.
