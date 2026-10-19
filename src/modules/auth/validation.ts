import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Use at least 8 characters.").max(128),
});
export const codeSchema = z.object({ code: z.string().regex(/^\d{6}$/, "Enter the six-digit code.") });
export const challengeSchema = z.object({
  code: z.string().regex(/^\d{6}$/),
  proof: z.string().regex(/^[a-f0-9]{64}$/),
  sessionId: z.string().uuid(),
});
