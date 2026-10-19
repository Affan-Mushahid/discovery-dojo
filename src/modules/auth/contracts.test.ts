import { describe, expect, it, vi } from "vitest";
import { deliverLoginChallenge } from "./contracts";

describe("login challenge delivery", () => {
  it("returns only the proof after delivery", async () => {
    const store = { begin: vi.fn().mockResolvedValue("encrypted"), complete: vi.fn() };
    const decryptor = { decrypt: vi.fn().mockResolvedValue({ code: "001234", proof: "proof", sessionId: "session" }) };
    const delivery = { sendCode: vi.fn().mockResolvedValue(undefined) };
    await expect(deliverLoginChallenge(store, decryptor, delivery, "a@example.com", "session")).resolves.toBe("proof");
    expect(delivery.sendCode).toHaveBeenCalledWith("a@example.com", "001234");
  });
  it("never delivers a challenge for another session", async () => {
    const delivery = { sendCode: vi.fn() };
    await expect(deliverLoginChallenge(
      { begin: async () => "encrypted", complete: async () => false },
      { decrypt: async () => ({ code: "123456", proof: "secret", sessionId: "other" }) },
      delivery, "a@example.com", "current",
    )).rejects.toThrow("Session changed");
    expect(delivery.sendCode).not.toHaveBeenCalled();
  });
  it("does not expose a proof on delivery failure", async () => {
    await expect(deliverLoginChallenge(
      { begin: async () => "encrypted", complete: async () => false },
      { decrypt: async () => ({ code: "123456", proof: "secret", sessionId: "current" }) },
      { sendCode: async () => { throw new Error("Delivery failed"); } }, "a@example.com", "current",
    )).rejects.toThrow("Delivery failed");
  });
});
