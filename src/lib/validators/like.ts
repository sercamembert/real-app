import { z } from "zod";
export const LikeValidator = z.object({
  isLiked: z.boolean(),
  postId: z.string(),
});

export type LikeRequest = z.infer<typeof LikeValidator>;
