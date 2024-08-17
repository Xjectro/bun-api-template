import { Request, Response } from "express";
import {
  response,
  exceptionResponse,
} from "../infrastructure/commons/response";
import { updateStates, createAvatarURL } from "../services/dbServices";
import { User } from "../database/models/users";
import { generateAccessToken } from "../utils/auth/accessToken";

export default class UsersController {
  public async me(_: Request, res: Response) {
    try {
      const user = res.locals.user;
      return response(res, {
        code: 201,
        success: true,
        message: "Successfully get user",
        data: user,
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  }

  public async meUpdate(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      const { ...rest } = req.body;

      delete rest.access_token;
      delete rest.refresh_token;
      delete rest.user_id;
      delete rest.password;
      delete rest.createdAt;
      delete rest.updatedAt;
      delete rest.email;

      const state = updateStates(rest);

      const data = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarURL: createAvatarURL(user.firstName, user.lastName),
      };

      const access_token = generateAccessToken(data);

      await User.findOneAndUpdate(
        { email: user.email },
        {
          $set: { ...state, access_token },
        },
      );

      return response(res, {
        code: 201,
        success: true,
        message: "Successfully update user",
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
