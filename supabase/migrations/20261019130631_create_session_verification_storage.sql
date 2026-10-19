create extension if not exists pgcrypto with schema extensions;

create table if not exists public.auth_delivery_keys (
  id boolean primary key default true check (id),
  public_key text not null check (length(public_key) between 100 and 20000)
);
alter table public.auth_delivery_keys enable row level security;
revoke all on public.auth_delivery_keys from public, anon, authenticated;

create table if not exists public.login_verifications (
  session_id uuid primary key references auth.sessions(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  verified_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists login_verifications_user_idx on public.login_verifications(user_id);
alter table public.login_verifications enable row level security;
revoke all on public.login_verifications from public, anon, authenticated;

create table if not exists public.verification_codes (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  session_id uuid not null references auth.sessions(id) on delete cascade,
  code_hash bytea not null,
  proof_hash bytea not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  last_sent_at timestamptz not null default now(),
  bucket_started_at timestamptz not null default now(),
  sends integer not null default 1 check (sends between 1 and 5),
  attempts integer not null default 0 check (attempts between 0 and 5)
);
alter table public.verification_codes enable row level security;
revoke all on public.verification_codes from public, anon, authenticated;
comment on table public.verification_codes is 'No client access. Security-definer RPCs serialize issuance and consume hashes atomically.';
comment on table public.auth_delivery_keys is 'Public RSA OpenPGP delivery key only. Private key stays in application Secrets.';
