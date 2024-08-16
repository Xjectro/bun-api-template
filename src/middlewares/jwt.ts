import { Request, Response, NextFunction } from "express";
import {
  NotFoundError,
  UnauthorizedError,
  ForbiddenAccessError,
} from "../utils/commons/exceptions";
import { exceptionResponse } from "../utils/commons/response";
import { verifyAccessToken } from "../utils/auth/accessToken";

interface CustomRequest extends Request {
  user?: any;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"] as string;
  const token = authHeader?.replace("Bearer ", "").trim();

  if (!token) {
    return new NotFoundError("A token is required for authentication");
  }

  try {
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return new UnauthorizedError("Your token does not match our credentials");
    }

    res.locals = {
      user: decoded,
    };

    next();
  } catch (error) {
    return exceptionResponse(res, error);
  }
};

export const verifyRole = (roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (user && roles.includes(user.role)) {
        return next();
      }
      throw new ForbiddenAccessError(
        "You are not allowed to access this resource!",
      );
    } catch (error) {
      return exceptionResponse(res, error);
    }
  };
};
