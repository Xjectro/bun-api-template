import { z } from "zod";

export const XSchema = z.object({
  code: z.string().min(1, "Code is required"),
  code_verifier: z.string().min(1, "code_verifier is required"),
});
