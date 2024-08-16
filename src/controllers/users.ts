import { Request, Response } from "express";
import { response, exceptionResponse } from "../utils/commons/response";
import { updateStates, createAvatarURL } from "../services/dbServices";
import { User } from "../database/models/users";
import { generateAccessToken } from "../utils/auth/accessToken";

export const usersMe = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    return response(res, {
      code: 201,
      success: true,
      message: "Successfully get user",
      content: user,
    });
  } catch (error) {
    return exceptionResponse(res, error);
  }
};

export const usersUpdate = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const { ...rest } = req.body;

    delete rest.accessToken;
    delete rest.refreshToken;
    delete rest.password;
    delete rest.createdAt;
    delete rest.updatedAt;
    delete rest.email;

    const state = updateStates(rest);

    const data = {
      userId: user.userId,
      refreshToken: user.refreshToken,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarURL: createAvatarURL(user.firstName, user.lastName),
    };

    const accessToken = generateAccessToken(data);

    await User.findOneAndUpdate(
      { email: user.email },
      {
        $set: { ...state, accessToken },
      },
    );

    return response(res, {
      code: 201,
      success: true,
      message: "Successfully update user",
      content: {
        accessToken,
        data,
      },
    });
  } catch (error) {
    return exceptionResponse(res, error);
  }
};
