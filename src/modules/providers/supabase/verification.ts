import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { VerificationStore } from "@/modules/auth/contracts";

export function verificationStore(client: SupabaseClient): VerificationStore {
  return {
    async begin() {
      const { data, error } = await client.rpc("begin_login_verification");
      if (error) {
        const message = error.message;
        if (/Wait 60|limit reached|not configured/.test(message)) throw new Error(message);
        throw new Error("Verification is unavailable. Approve the database migrations and configure the delivery key.");
      }
      if (typeof data !== "string") throw new Error("Verification challenge is unavailable.");
      return data;
    },
    async complete(code, proof) {
      const { data, error } = await client.rpc("complete_login_verification", { p_code: code, p_proof: proof });
      if (error) throw new Error("Verification is unavailable. Check the database setup.");
      return data === true;
    },
  };
}
