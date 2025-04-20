import { z } from "zod";
export const PasswordValidator = z.object({
  password: z.string(),
  matchingPassword: z.string(),
  token: z.string(),
});

export type PasswordRequest = z.infer<typeof PasswordValidator>;
