# Provider boundaries

Phase 4 adds a server-only OpenRouter free-router adapter and Supabase-backed simulation persistence. Provider availability is variable; rate limits or outages preserve submitted messages where possible and show a retryable error.

- `supabase/`: signed-in cookie session, verification RPC and persistence adapters; no service-role key.
- `openrouter/`: placeholder for future server-only text generation using the free router.
- `email/`: Gmail OAuth2 transport and OpenPGP challenge decryption. See `docs/auth-setup.md`.

Domain modules own contracts; adapters implement them. Route Handlers will be thin
composition/validation layers under `src/app/api/` when actual routes are needed.
Never import infrastructure SDKs into domain logic or UI components. Mark future
credential-bearing adapter files with `import "server-only"`.

Voice is intentionally absent. Later speech adapters should consume/produce text
without coupling conversation rules to Google TTS or browser speech APIs.
