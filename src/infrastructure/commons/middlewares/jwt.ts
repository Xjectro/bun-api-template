import { Request, Response, NextFunction } from "express";
import {
  NotFoundError,
  UnauthorizedError,
  ForbiddenAccessError,
} from "../exceptions";
import { exceptionResponse } from "../response";
import { verifyAccessToken } from "../../../utils/auth/accessToken";
import { verifyRefreshToken } from "../../../utils/auth/refreshToken";

interface CustomRequest extends Request {
  user?: any;
}

export const auth = (type: "refresh" | "access") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"] as string;

    const prefix = type === "refresh" ? "Refresh " : "Bearer ";
    const token = authHeader?.replace(prefix, "").trim();

    try {
      if (!token) {
        throw new NotFoundError("A token is required for authentication");
      }

      let decoded: object | undefined;
      if (type === "access") {
        decoded = verifyAccessToken(token);
      } else if (type === "refresh") {
        decoded = verifyRefreshToken(token);
      }

      if (!decoded) {
        throw new UnauthorizedError(
          "Your token does not match our credentials",
        );
      }

      res.locals = {
        user: decoded,
      };

      next();
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };
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
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };
};
