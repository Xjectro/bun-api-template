import { z } from "zod";

export const refreshSchema = z.object({
  refresh_token: z.string().min(1, "Refresh token is required"),
  access_token: z.string().min(1, "Access token is required"),
});
