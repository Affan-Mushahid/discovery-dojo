// Pure cookie-envelope helpers; no framework or provider dependency.
const sessionPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const proofPattern = /^[a-f0-9]{64}$/;
export const loginProofCookie = "dojo-login-proof";

export function encodeLoginProof(sessionId: string, proof: string): string {
  if (!sessionPattern.test(sessionId) || !proofPattern.test(proof)) {
    throw new Error("Invalid login challenge envelope.");
  }
  return `${sessionId}.${proof}`;
}

export function readLoginProof(value: string | undefined, sessionId: string): string | null {
  if (!value || !sessionPattern.test(sessionId)) return null;
  const parts = value.split(".");
  if (parts.length !== 2 || parts[0] !== sessionId || !proofPattern.test(parts[1])) return null;
  return parts[1];
}
