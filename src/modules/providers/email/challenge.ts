import "server-only";
import { decrypt, readMessage, readPrivateKey } from "openpgp";
import { challengeSchema } from "@/modules/auth/validation";
import type { ChallengeDecryptor } from "@/modules/auth/contracts";

export function challengeDecryptor(): ChallengeDecryptor {
  const armoredKey = process.env.LOGIN_CODE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!armoredKey) throw new Error("Add LOGIN_CODE_PRIVATE_KEY in Secrets and register its public key through an approved migration.");
  return {
    async decrypt(ciphertext) {
      try {
        const privateKey = await readPrivateKey({ armoredKey });
        const message = await readMessage({ binaryMessage: Buffer.from(ciphertext, "base64") });
        const { data } = await decrypt({ message, decryptionKeys: privateKey, format: "utf8" });
        return challengeSchema.parse(JSON.parse(data));
      } catch {
        throw new Error("The email verification encryption keys are missing or do not match. Check the delivery-key setup.");
      }
    },
  };
}
