import { z } from "zod";
export const FollowValidator = z.object({
  isFollowed: z.boolean().optional(),
  userId: z.string(),
});

export type FollowRequest = z.infer<typeof FollowValidator>;
