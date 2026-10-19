import { describe, expect, it } from "vitest";
import { credentialsSchema, codeSchema } from "./validation";
import { profileSchema } from "@/modules/profiles/validation";

describe("input validation", () => {
  it("normalizes email without modifying passwords", () => {
    expect(credentialsSchema.parse({ email: " Person@Example.com ", password: " a secret " })).toEqual({ email: "person@example.com", password: " a secret " });
  });
  it("rejects malformed codes and short passwords", () => {
    for (const code of ["12345", "1234567", "abcdef", "123 45"]) expect(codeSchema.safeParse({ code }).success).toBe(false);
    expect(codeSchema.parse({ code: "001234" }).code).toBe("001234");
    expect(credentialsSchema.safeParse({ email: "a@b.com", password: "short" }).success).toBe(false);
  });
  it("accepts minimal profiles and strips untrusted ownership", () => {
    expect(profileSchema.parse({ name: " Alex ", age: "25", company: "", user_id: "other" })).toEqual({ name: "Alex", age: 25, company: "" });
  });
  it("rejects blank names and invalid ages", () => {
    for (const age of ["", 12, 121, 25.5, "not a number"]) expect(profileSchema.safeParse({ name: "Alex", age }).success).toBe(false);
    expect(profileSchema.safeParse({ name: " ", age: 25 }).success).toBe(false);
  });
});
