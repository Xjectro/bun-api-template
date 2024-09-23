import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { exceptionResponse } from "../api/response";
import { extractValidationErrors, throwValidationError } from "./helpers.util";
import * as authSchema from "./schemas/auth.schema";
import * as tokenSchema from "./schemas/token.schema";
import * as userSchema from "./schemas/user.schema";

const validateBody = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (result.success) return next();

      const extractedErrors = extractValidationErrors(result);
      console.log(extractedErrors);
      throwValidationError(extractedErrors);

      return next();
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };
};

export default validateBody;
export { authSchema, tokenSchema, userSchema };
