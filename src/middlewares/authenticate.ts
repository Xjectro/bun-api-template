import { verifyJWT } from '../utils/modules/jwt';
import { User } from '../database/models/user.model';
import { exceptionResponse } from '../api/commons/response';
import { type Request, type Response, type NextFunction } from 'express';
import { NotFoundError, UnauthorizedError, ForbiddenAccessError } from '../api/commons/exceptions';

interface CustomRequest extends Request {
  user?: any;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.replace('Bearer', '').trim();

  try {
    if (!token) {
      throw new NotFoundError('Token is required for authentication');
    }

    const decoded = verifyJWT(token);

    if (!decoded) {
      throw new UnauthorizedError('Token does not match credentials');
    }

    const user = await User.findById(decoded.id).populate("auth");

    if (!user) {
      throw new UnauthorizedError('Token does not match credentials 2');
    }

    res.locals = {
      user: {
        ...user.toObject({ virtuals: true }),
      },
    };

    next();
  } catch (error: any) {
    return exceptionResponse(res, error);
  }
};

export const verifyRole = (roles: string[]) => {
  return (_: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;

      if (user && roles.includes(user.auth.role)) {
        return next();
      }

      throw new ForbiddenAccessError('You are not allowed to access this resource!');
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };
};
