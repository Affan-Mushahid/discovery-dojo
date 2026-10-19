# Provider boundaries

These directories are placeholders, not working integrations.

- `supabase/`: future persistence and session adapters; separate browser/server entries.
- `openrouter/`: future server-only text generation using the free router.
- `email/`: future server-only Gmail OAuth2 transport using Nodemailer.

Domain modules own contracts; adapters implement them. Route Handlers will be thin
composition/validation layers under `src/app/api/` when actual routes are needed.
Never import infrastructure SDKs into domain logic or UI components. Mark future
credential-bearing adapter files with `import "server-only"`.

Voice is intentionally absent. Later speech adapters should consume/produce text
without coupling conversation rules to Google TTS or browser speech APIs.
