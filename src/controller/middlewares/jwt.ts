import { Request, Response, NextFunction } from "express";
import {
    NotFoundError,
    UnauthorizedError,
    ForbiddenAccessError,
} from "../../utils/commons/exceptions";
import { exceptionResponse } from "../../utils/commons/response";
import { verifyAccessToken } from "../auth/accessToken";

interface CustomRequest extends Request {
    user: string | undefined;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers?.["authorization"];
    const token = authHeader && authHeader.replace("Bearer ", "");

    try {
        if (!token)
            throw new NotFoundError("A token is required for authentication");

        const decoded = verifyAccessToken(token);

        if (!decoded) {
            throw new UnauthorizedError("Your token does not match our credentials");
        }

        res.locals = {
            user: decoded,
        };
    } catch (error) {
        return exceptionResponse(res, error);
    }

    return next();
};

export const verifyRole = (roles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const role = res.locals.user?.role;
            if (roles.includes(role)) return next();
            else
                throw new ForbiddenAccessError(
                    "You are not allowed to access this resource!"
                );
        } catch (error) {
            return exceptionResponse(res, error);
        }
    };
};
