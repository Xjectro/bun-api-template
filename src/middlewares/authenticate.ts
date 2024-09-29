import { type Request, type Response, type NextFunction } from 'express';
import { NotFoundError, UnauthorizedError, ForbiddenAccessError } from '../api/commons/exceptions';
import { exceptionResponse } from '../api/commons/response';
import { verifyJwt } from '../utils/auth/jwt';
import { UserAuth } from '../database/models/userAuth.model';

interface CustomRequest extends Request {
  user?: any;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'] as string;
  const token = authHeader?.replace('Bearer', '').trim();

  try {
    if (!token) {
      throw new NotFoundError('A token is required for authentication');
    }

    const decoded = verifyJwt(token);

    if (!decoded) {
      throw new UnauthorizedError('Your token does not match our credentials');
    }

    const userAuth = await UserAuth.findOne({ user: decoded.id }).populate('user').select('email role user tfa').exec();

    if (!userAuth) {
      throw new UnauthorizedError('Your token does not match our credentials');
    }

    res.locals = {
      user: {
        ...userAuth.user.toObject({ virtuals: true }),
        tfa: userAuth.tfa,
        email: userAuth.email,
        role: userAuth.role,
      },
    };

    next();
  } catch (error: any) {
    return exceptionResponse(res, error);
  }
};

export const verifyRole = (roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;

      if (user && roles.includes(user.role)) {
        return next();
      }

      throw new ForbiddenAccessError('You are not allowed to access this resource!');
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };
};
