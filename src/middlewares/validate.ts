import { z } from 'zod';
import { exceptionResponse } from '../api/commons/response';
import { UnprocessableEntityError } from '../api/commons/exceptions';
import { type Request, type Response, type NextFunction } from 'express';

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

export { validateBody }
