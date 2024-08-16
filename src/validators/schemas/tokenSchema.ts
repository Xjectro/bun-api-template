import { z } from "zod";

export const tokenRefresh = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
  accessToken: z.string().min(1, "Access token is required"),
});
