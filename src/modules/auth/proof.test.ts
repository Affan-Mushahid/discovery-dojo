import { describe, expect, it } from "vitest";
import { encodeLoginProof, readLoginProof } from "./proof";

const session = "e457b3e4-2d55-4cc6-8afb-775c4a503dab";
const other = "18ce006a-3c29-471b-93e7-987d4eb2f4c7";
const proof = "a".repeat(64);

describe("session-bound proof envelopes", () => {
  it("accepts only an exact matching session and proof", () => {
    expect(readLoginProof(encodeLoginProof(session, proof), session)).toBe(proof);
    expect(readLoginProof(encodeLoginProof(session, proof), other)).toBeNull();
  });
  it("rejects missing, truncated and appended values", () => {
    for (const value of [undefined, "", `${session}.short`, `${session}.${proof}.extra`, `${session}.${"A".repeat(64)}`]) {
      expect(readLoginProof(value, session)).toBeNull();
    }
  });
  it("refuses malformed challenges before setting a cookie", () => {
    expect(() => encodeLoginProof("bad-session", proof)).toThrow();
    expect(() => encodeLoginProof(session, "bad-proof")).toThrow();
  });
});
