import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { exceptionResponse } from "../api/response";
import { UnprocessableEntityError } from "../utils/exceptions";
import * as authSchemas from "./schemas/auth";
import * as tokenSchemas from "./schemas/token";
import * as connectionSchemas from "./schemas/connection";

const validateBody = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (result.success) return next();
      let extractedErrors: any = [];
      result.error.issues.map((issue) => {
        issue.message = issue.message.replace(/_/g, " ");
        extractedErrors.push({
          [issue.path[0]]: issue.message,
        });
      });

      if (extractedErrors.length > 0)
        throw new UnprocessableEntityError(
          "Validation Failed",
          extractedErrors,
        );

      return next();
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };
};

export default validateBody;
export { authSchemas, tokenSchemas, connectionSchemas };
