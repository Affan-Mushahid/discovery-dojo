# Reusable authentication and profile modules

The design adapts marketplace gig 92's hashed, expiring, single-use OTP pattern and delivery boundary to Supabase Auth. It does not copy NestJS/Prisma credentials or token issuance, log OTPs, or issue app access before verification.

## Public boundaries

- `modules/auth/validation.ts`: pure Zod credentials/code schemas.
- `modules/auth/contracts.ts`: `VerificationStore`, `ChallengeDecryptor`, `CodeDelivery` ports and `deliverLoginChallenge` orchestration. No Next.js/provider SDK imports. Returns only a proof after delivery; checks session binding.
- `modules/auth/components/`: client auth, code and logout forms. Depend on a small relative JSON API contract (`message`, `error`, optional `redirect`), never a provider SDK.
- `modules/profiles/validation.ts`: pure minimal profile schema/type.
- `modules/profiles/components/profile-form.tsx`: reusable private profile form with initial profile/email props. All fields still validated server-side.
- `modules/providers/supabase/`: server session and persistence adapters as signed-in user only.
- `modules/providers/email/`: separate Gmail OAuth transport and PGP challenge decryptor, both server-only.
- `modules/auth/session.ts`: Next/Supabase application guard; intentionally not in the safe public barrel.
- `app/api/`: composition, same-origin checks, input parsing, cookies and response handling.

For extraction, package the pure contracts/validation first, inject endpoint paths/navigation into presentation components as needed, and keep server adapters as opt-in entries. Do not publish packages or introduce a monorepo yet. Database RPCs remain the trusted atomic implementation of hashing, quotas and consumption; moving only UI does not reproduce the security boundary. Configuration and operational limitations are in `docs/auth-setup.md`.
