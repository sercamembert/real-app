import { z } from "zod";
export const SettingsValidator = z.object({
  username: z.string().max(20).optional(),
  biogram: z.string().max(300).optional(),
  avatarUrl: z.string().optional(),
});

export type SettingsRequest = z.infer<typeof SettingsValidator>;
