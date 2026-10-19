import { describe, expect, it } from "vitest";
import { profileSchema } from "./validation";

describe("private profile validation", () => {
  it("normalizes minimal onboarding and strips ownership fields", () => {
    expect(profileSchema.parse({ name: " Alex ", age: "25", user_id: "another-user", email: "ignored@example.com" }))
      .toEqual({ name: "Alex", age: 25, company: "" });
  });
  it("rejects coerced non-input types and invalid ranges", () => {
    for (const age of [true, false, null, [], [25], {}, "", "13.5", 12, 121, "Infinity"]) {
      expect(profileSchema.safeParse({ name: "Alex", age }).success).toBe(false);
    }
  });
  it("enforces bounded names and company values", () => {
    expect(profileSchema.safeParse({ name: " ", age: 25 }).success).toBe(false);
    expect(profileSchema.safeParse({ name: "a".repeat(81), age: 25 }).success).toBe(false);
    expect(profileSchema.safeParse({ name: "Alex", age: 25, company: "a".repeat(121) }).success).toBe(false);
  });
});
