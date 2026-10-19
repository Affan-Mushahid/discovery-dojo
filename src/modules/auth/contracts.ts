export interface LoginChallenge {
  code: string;
  proof: string;
  sessionId: string;
}
export interface ChallengeDecryptor {
  decrypt(ciphertext: string): Promise<LoginChallenge>;
}
export interface CodeDelivery {
  sendCode(email: string, code: string): Promise<void>;
}
export interface VerificationStore {
  begin(): Promise<string>;
  complete(code: string, proof: string): Promise<boolean>;
}

// Provider-independent orchestration. Never return the code to the browser.
export async function deliverLoginChallenge(
  store: VerificationStore,
  decryptor: ChallengeDecryptor,
  delivery: CodeDelivery,
  email: string,
  sessionId: string,
): Promise<string> {
  const challenge = await decryptor.decrypt(await store.begin());
  if (challenge.sessionId !== sessionId) throw new Error("Session changed. Sign in again.");
  await delivery.sendCode(email, challenge.code);
  return challenge.proof;
}
