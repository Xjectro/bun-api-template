import { type Request, type Response } from "express";
import { exceptionResponse, response } from "../../api/response";
import TokenHelpers from "./helpers.utils";
import { generateAccessToken } from "../../utils/auth/accessToken";
import { UnauthorizedError } from "../../utils/exceptions";
import { verifyRefreshToken } from "../../utils/auth/refreshToken";
import { UserAuth } from "../../database/models/userAuth.model";
import { User } from "../../database/models/user.model";

export default class TokenController {
  private helpers: TokenHelpers;

  constructor() {
    this.helpers = new TokenHelpers();
  }

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

      const id = decoded.id;

      const userAuth = await UserAuth.findOne({ refresh_token }).exec();
      if (!userAuth) {
        throw new UnauthorizedError("Refresh token is incorrect or expired");
      }

      const user = await User.findById(id).select("email").exec();
      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      const access_token = generateAccessToken({
        created: new Date(),
        id: userAuth.user,
      });

      return response(res, {
        code: 201,
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
