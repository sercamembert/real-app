import { z } from "zod";
export const EmailValidator = z.object({
  email: z.string(),
});

export type EmailRequest = z.infer<typeof EmailValidator>;
