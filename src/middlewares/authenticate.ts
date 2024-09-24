import { type Request, type Response, type NextFunction } from "express";
import {
  NotFoundError,
  UnauthorizedError,
  ForbiddenAccessError,
} from "../api/commons/exceptions";
import { exceptionResponse } from "../api/commons/response";
import { verifyAccessToken } from "../utils/auth/accessToken";
import { User } from "../database/models/user.model";
import { UserAuth } from "../database/models/userAuth.model";

interface CustomRequest extends Request {
  user?: any;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"] as string;
  const token = authHeader?.replace("Bearer", "").trim();

  try {
    if (!token) {
      throw new NotFoundError("A token is required for authentication");
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      throw new UnauthorizedError("Your token does not match our credentials");
    }

    const userAuth = await UserAuth.findOne({ user: decoded.id })
      .select("email role user")
      .exec();

    if (!userAuth) {
      throw new UnauthorizedError("Your token does not match our credentials");
    }

    const user = await User.findById(userAuth.user)
      .select(
        "firstName lastName username avatarURL user_id description createdAt updatedAt bannerURL",
      )
      .exec();

    if (!user) {
      throw new UnauthorizedError("User details could not be found");
    }

    const {
      user_id,
      firstName,
      lastName,
      username,
      avatarURL,
      description,
      bannerURL,
    } = user.toObject({ virtuals: true });

    res.locals = {
      user: {
        _id: userAuth.user,
        id: user_id,
        firstName,
        lastName,
        username,
        avatarURL,
        description,
        role: userAuth.role,
        bannerURL,
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

      throw new ForbiddenAccessError(
        "You are not allowed to access this resource!",
      );
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };
};
