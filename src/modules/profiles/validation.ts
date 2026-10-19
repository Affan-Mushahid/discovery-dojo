import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(80),
  age: z.union([z.string().trim().regex(/^\d+$/, "Enter your age as a whole number."), z.number()])
    .pipe(z.coerce.number().int("Enter a whole number.").min(13, "You must be at least 13.").max(120)),
  company: z.string().trim().max(120).default(""),
});
export type Profile = z.infer<typeof profileSchema>;
