# Authentication setup and security boundary

## Current deployment status

Five migrations were submitted through `apply_migration`; all are held for approval and **none have run**. The inspected public schema remains empty. Approve them in the Database panel in order:

1. `create_session_verification_storage`
2. `create_login_verification_rpcs`
3. `create_mvp_domain_tables`
4. `seed_shared_solar_scenario`
5. `reject_null_verification_inputs` — makes the completion RPC strict so SQL NULL arguments cannot bypass comparison checks. Approve this security hardening before enabling access.

Do not run handwritten SQL or apply later migrations before their dependencies. Table policies are versioned one-time migrations; the seed uses conflict-safe inserts and never overwrites edited content. No destructive reset is provided.

## Secrets and provider setup

Add values in the workspace **Secrets** panel, not a committed environment file. `.env.example` lists the variables. Supabase URL/anon values are already supplied in this preview. No service-role key is used.

- Enable Supabase email confirmation. Configure the project Site URL and allowed redirects for the eventual hosting origin. Signup sends the Supabase confirmation email; after following that link, return to `/login`. No confirmation callback session is required or trusted by this application.
- Configure personal Gmail OAuth with the Gmail SMTP scope `https://mail.google.com/`, offline access, and an authorized redirect URI during consent. Supply the sender, client ID, client secret and refresh token. Google OAuth testing-mode refresh tokens can expire in seven days; publishing/verification rules, Gmail sending limits and free-tier quotas must be checked for your account.
- Generate an **RSA OpenPGP** key pair (RSA 3072 or greater, compatible with Postgres pgcrypto; not an ECC-only key). Put the unencrypted armored private key in `LOGIN_CODE_PRIVATE_KEY` in Secrets. Literal `\n` separators are supported. Never send the private key in chat or commit it.
- Give only the armored **public key** to the coding agent to register in `auth_delivery_keys` using a separate approved `apply_migration`, with conflict-safe insertion. That provisioning migration cannot be created until your public key is supplied. The public key is not a credential. No SQL needs to be run by the user.

Until both migrations and key registration are approved, login/profile access stays locked with a setup message. Gmail failures never log or return codes and never enable a bypass.

## Why an encrypted challenge?

With an anon key and a signed-in user, server and browser otherwise have identical database permissions. Merely hiding an RPC in a route does not secure it. `begin_login_verification` generates a six-digit code plus a random 256-bit proof in Postgres, hashes both, and returns only a PGP-encrypted envelope. Only the Next.js server can decrypt it. The server emails the code and stores the proof in a short-lived HttpOnly, SameSite-strict cookie bound to the auth session. Verification requires both the typed code and that proof. A browser calling the RPC directly cannot decrypt the envelope or forge a completed verification.

Rows are locked during completion: five total attempts, ten-minute expiry, single use. Sends are serialized per user: 60-second cooldown and five per rolling hourly bucket, including other sessions. Resends invalidate previous codes; attempts do not reset within the hourly bucket. Supabase independently rate-limits password/signup requests. Delivery failure consumes a send slot; retry after cooldown. Direct RPC callers can exhaust their own send quota, not gain access.

`is_login_verified` checks `auth.uid()`, the JWT `session_id`, a matching live `auth.sessions` row, confirmed email, and a password entry in the signed JWT authentication-method references. Confirmation-link or other non-password sessions cannot enroll or pass the gate. Protected routes revalidate the user; protected table RLS repeats the gate. Refresh retains the same session ID, so no application timeout is imposed. Supabase expiry, refresh-token reuse, revocation and project settings still govern lifetime. Logout removes this session's gate and requests global Supabase signout. Revoked sessions lose access even if an access token has not yet expired when the underlying auth session is removed.

This is custom email verification, **not Supabase-native MFA/AAL2**. Password and inbox compromise remain risks. Use HTTPS in deployment. Do not cache private routes or responses. Auth tokens are HttpOnly cookies in this app; no client Supabase session/localStorage is used.

## Data permissions and future work

Profiles allow verified owner select/insert/update, no browser delete. `user_id` is the primary key, making onboarding upserts duplicate-safe. Email stays in Supabase Auth. Name: 1–80 characters; age: integer 13–120; optional company: at most 120. These are MVP validation defaults, not a legal age-verification system.

Shared scenarios are verified read-only. Hidden facts, code hashes, proofs, key rows and verification records have RLS and no client policies/grants. Simulations, ordered messages and evaluations are verified owner-read-only. Their writes and a narrowly scoped server access mechanism for hidden facts intentionally await the next phase; do not give a broad hidden-facts RPC to authenticated users. Composite foreign keys bind messages/evaluations to their simulation owner. Users cannot write scores or prospect messages directly.

## Checks before release

Run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` and `npm run test:e2e` (install Chromium first). These checks could not be executed by this build agent because no shell tool is available.

After configuration, test with two real users: signup confirmation; fresh login blocked before code; invalid/expired/replayed codes; sixth attempt; resend cooldown; rate limit across sessions; a fresh session cannot reuse another's proof; refresh preserves verification; duplicate profile saves create one row; user B cannot read/update user A by REST; unverified JWT cannot read profiles/scenarios; anonymous/authenticated clients cannot select code/hidden tables or insert login verifications; logout/revocation blocks old access. Real Gmail delivery and live RLS integration require the approved migrations and are not asserted by the included smoke/unit tests.

### Direct RPC negative checks

Include REST RPC calls with `p_code: null`, `p_proof: null`, and both null; none may return `true` or unlock profile/scenario access. The strict-function migration is required even though Next.js rejects these values. Also test non-password confirmation-link sessions and proof values with extra dot-separated segments. Migration approvals and delivery-key provisioning are deployment prerequisites, not steps the application silently performs.
