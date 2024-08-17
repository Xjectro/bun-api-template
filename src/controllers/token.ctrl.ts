import { Request, Response } from "express";
import {
  response,
  exceptionResponse,
} from "../infrastructure/commons/response";
import { createAvatarURL } from "../services/dbServices";
import { UnauthorizedError } from "../infrastructure/commons/exceptions";
import { User } from "../database/models/users";
import { generateAccessToken } from "../utils/auth/accessToken";

export default class TokenController {
  public async refresh(_: Request, res: Response) {
    try {
      const id = res.locals.user.id;

      const user = await User.findOne({ user_id: id }).exec();
      if (!user) {
        throw new UnauthorizedError("Refresh Token is incorrect!");
      }

      const data = {
        id: user.user_id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarURL: createAvatarURL(user.firstName, user.lastName),
      };

      const access_token = generateAccessToken(data);

      return response(res, {
        code: 201,
        success: true,
        message: "Code is valid. You can proceed with the reset.",
        data: {
          access_token,
          data,
        },
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  }
}
