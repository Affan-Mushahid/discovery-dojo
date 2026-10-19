import { cookies } from "next/headers";
import { credentialsSchema, codeSchema } from "@/modules/auth/validation";
import { deliverLoginChallenge } from "@/modules/auth/contracts";
import { passwordSession } from "@/modules/auth/session";
import { createSupabaseServer } from "@/modules/providers/supabase/server";
import { verificationStore } from "@/modules/providers/supabase/verification";
import { gmailDelivery } from "@/modules/providers/email/gmail";
import { challengeDecryptor } from "@/modules/providers/email/challenge";
import { apiError, assertSameOrigin, json, readBody } from "@/lib/http";

import { loginProofCookie as proofCookie, encodeLoginProof, readLoginProof } from "@/modules/auth/proof";

export const runtime = "nodejs";
export async function POST(request: Request, context: { params: Promise<{ action: string }> }) {
  try {
    assertSameOrigin(request);
    const { action } = await context.params;
    const client = await createSupabaseServer();
    const jar = await cookies();
    if (action === "signup" || action === "login") {
      const { email, password } = credentialsSchema.parse(await readBody(request));
      jar.delete(proofCookie);
      if (action === "signup") {
        const { error } = await client.auth.signUp({ email, password });
        // Never retain an auto-confirmed signup session: password + code is still required.
        await client.auth.signOut({ scope: "local" });
        if (error) return json({ error: "Unable to create an account. Check your details or try again later." }, 400);
        return json({ message: "Check your inbox to confirm your email, then return here to sign in. If you already have an account, sign in instead." });
      }
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) return json({ error: "Unable to sign in. Check your email, password and email confirmation." }, 400);
      return json({ redirect: "/verify" });
    }
    if (action === "logout") {
      const { error: revokeError } = await client.rpc("revoke_login_verification");
      const { error } = await client.auth.signOut({ scope: "global" });
      jar.delete(proofCookie);
      if (error || revokeError) return json({ error: "Logout could not be fully confirmed. Please retry; revocation requires the database migrations." }, 503);
      return json({ redirect: "/login" });
    }
    if (action === "send-code") {
      const { client: sessionClient, user, sessionId } = await passwordSession();
      const delivery = gmailDelivery();
      const decryptor = challengeDecryptor();
      const proof = await deliverLoginChallenge(verificationStore(sessionClient), decryptor, delivery, user.email!, sessionId);
      jar.set(proofCookie, encodeLoginProof(sessionId, proof), {
        httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/api/auth", maxAge: 600,
      });
      return json({ message: "Code sent. Check your inbox. It expires in 10 minutes." });
    }
    if (action === "verify-code") {
      const { code } = codeSchema.parse(await readBody(request));
      const { client: sessionClient, sessionId } = await passwordSession();
      const proof = readLoginProof(jar.get(proofCookie)?.value, sessionId);
      if (!proof) return json({ error: "Request a code from this browser first." }, 400);
      const valid = await verificationStore(sessionClient).complete(code, proof);
      if (!valid) return json({ error: "Invalid, expired or already used code. Five attempts maximum; request a new code if needed." }, 400);
      jar.delete(proofCookie);
      return json({ redirect: "/profile" });
    }
    return json({ error: "Not found." }, 404);
  } catch (error) { return apiError(error); }
}
