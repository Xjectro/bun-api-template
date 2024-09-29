import { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { exceptionResponse } from '../../commons/response';
import { UnprocessableEntityError } from '../../commons/exceptions';
import * as authSchema from './schemas/auth.schema';
import * as tokenSchema from './schemas/token.schema';
import * as userSchema from './schemas/user.schema';
import * as appSchema from './schemas/app.schema';

const validateBody = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (result.success) return next();

      const extractedErrors = result.error.issues.map((issue) => ({
        [issue.path[0]]: issue.message.replace(/_/g, ' '),
      }));

      if (extractedErrors.length > 0) {
        throw new UnprocessableEntityError('Validation Failed', extractedErrors);
      }

      return next();
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };
};

export default validateBody;
export { authSchema, tokenSchema, userSchema, appSchema };
