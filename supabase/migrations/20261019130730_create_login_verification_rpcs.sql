create or replace function public.begin_login_verification() returns text
language plpgsql security definer set search_path = '' as $$
declare
 uid uuid := auth.uid(); sid uuid := nullif(auth.jwt()->>'session_id','')::uuid;
 rec public.verification_codes; key_text text; otp text; proof text; payload text;
 sends integer;
begin
 if uid is null or not exists(select 1 from auth.sessions s join auth.users u on u.id=s.user_id where s.id=sid and s.user_id=uid and u.email_confirmed_at is not null and (s.not_after is null or s.not_after > now())) then raise exception 'Sign in with a confirmed email first'; end if;
 perform pg_advisory_xact_lock(hashtextextended(uid::text, 0));
 select public_key into key_text from public.auth_delivery_keys where id='login';
 if key_text is null then raise exception 'Email verification encryption key is not configured'; end if;
 select * into rec from public.verification_codes where session_id=sid for update;
 if rec.last_sent_at > now()-interval '60 seconds' then raise exception 'Wait 60 seconds before requesting another code'; end if;
 select coalesce(sum(send_count),0) into sends from public.verification_codes where user_id=uid and window_started_at > now()-interval '1 hour';
 if sends >= 5 then raise exception 'Email limit reached. Try again in one hour'; end if;
 if rec.window_started_at > now()-interval '1 hour' and rec.attempts >= 5 then raise exception 'Attempt limit reached. Try again in one hour'; end if;
 otp := lpad(((('x'||encode(extensions.gen_random_bytes(4),'hex'))::bit(32)::bigint % 1000000))::text,6,'0');
 proof := encode(extensions.gen_random_bytes(32),'hex');
 insert into public.verification_codes(session_id,user_id,code_hash,proof_hash,expires_at)
 values(sid,uid,encode(extensions.digest(otp,'sha256'),'hex'),encode(extensions.digest(proof,'sha256'),'hex'),now()+interval '10 minutes')
 on conflict(session_id) do update set code_hash=excluded.code_hash,proof_hash=excluded.proof_hash,expires_at=excluded.expires_at,consumed_at=null,last_sent_at=now(),
 attempts=case when verification_codes.window_started_at > now()-interval '1 hour' then verification_codes.attempts else 0 end,
 send_count=case when verification_codes.window_started_at > now()-interval '1 hour' then verification_codes.send_count+1 else 1 end,
 window_started_at=case when verification_codes.window_started_at > now()-interval '1 hour' then verification_codes.window_started_at else now() end;
 payload := json_build_object('code',otp,'proof',proof,'sessionId',sid)::text;
 return encode(extensions.pgp_pub_encrypt(payload,extensions.dearmor(key_text)),'base64');
end; $$;
create or replace function public.complete_login_verification(p_code text, p_proof text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare rec public.verification_codes; uid uuid := auth.uid(); sid uuid := nullif(auth.jwt()->>'session_id','')::uuid;
begin
 if uid is null then return false; end if;
 select * into rec from public.verification_codes where session_id=sid and user_id=uid for update;
 if not found or rec.consumed_at is not null or rec.expires_at <= now() or rec.attempts >= 5 then return false; end if;
 update public.verification_codes set attempts=attempts+1 where session_id=sid;
 if length(p_code) <> 6 or length(p_proof) <> 64 or encode(extensions.digest(p_code,'sha256'),'hex') <> rec.code_hash or encode(extensions.digest(p_proof,'sha256'),'hex') <> rec.proof_hash then return false; end if;
 if not exists(select 1 from auth.sessions s join auth.users u on u.id=s.user_id where s.id=sid and s.user_id=uid and u.email_confirmed_at is not null and (s.not_after is null or s.not_after>now())) then return false; end if;
 update public.verification_codes set consumed_at=now() where session_id=sid;
 insert into public.login_verifications(session_id,user_id) values(sid,uid) on conflict(session_id) do nothing;
 return true;
end; $$;
create or replace function public.revoke_login_verification() returns void
language sql security definer set search_path = '' as $$
 delete from public.login_verifications where user_id=auth.uid() and session_id=nullif(auth.jwt()->>'session_id','')::uuid;
$$;
revoke all on function public.begin_login_verification() from public, anon;
revoke all on function public.complete_login_verification(text,text) from public, anon;
revoke all on function public.revoke_login_verification() from public, anon;
grant execute on function public.begin_login_verification(), public.complete_login_verification(text,text), public.revoke_login_verification() to authenticated;
