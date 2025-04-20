import { z } from "zod";
export const DeleteValidator = z.object({
  postId: z.string(),
  userId: z.string(),
});

export type DeleteRequest = z.infer<typeof DeleteValidator>;
