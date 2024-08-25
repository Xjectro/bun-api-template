import { type Request, type Response } from "express";
import { response, exceptionResponse } from "../api/response";
import { UnauthorizedError } from "../utils/exceptions";
import { User } from "../database/models/user.model";
import { UserAuth } from "../database/models/userAuth.model";
import { generateAccessToken } from "../utils/auth/accessToken";
import { verifyRefreshToken } from "../utils/auth/refreshToken";

export default class TokenController {
  public async refresh(req: Request, res: Response) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        throw new UnauthorizedError("No refresh token provided");
      }

      const decoded = verifyRefreshToken(refresh_token);
      if (!decoded) {
        throw new UnauthorizedError("Invalid refresh token");
      }

      const id = decoded?.id;
      if (!id) {
        throw new UnauthorizedError("Invalid refresh token ID");
      }

      const userAuth = await UserAuth.findOne({ refresh_token }).exec();
      if (!userAuth) {
        throw new UnauthorizedError("Refresh token is incorrect or expired");
      }

      const user = await User.findById(userAuth.user).select("email").exec();
      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      const access_token = generateAccessToken({ id });

      return response(res, {
        code: 200,
        success: true,
        message: "Refresh token is valid. Access token generated.",
        data: {
          access_token,
          refresh_token,
        },
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  }
}
