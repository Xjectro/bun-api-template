import { Request, Response } from "express";
import { response, exceptionResponse } from "../utils/commons/response";
import { createAvatarURL } from "../services/dbServices";
import { UnauthorizedError } from "../utils/commons/exceptions";
import { User } from "../database/models/users";
import { generateAccessToken } from "../utils/auth/accessToken";
import { verifyRefreshToken } from "../utils/auth/refreshToken";

export const renewAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      throw new UnauthorizedError("Refresh Token is incorrect!");
    }

    const id = decoded.id;

    if (!id) {
      throw new UnauthorizedError("Refresh Token is incorrect!");
    }

    const user = await User.findOne({ userId: id }).exec();
    if (!user) {
      throw new UnauthorizedError("Refresh Token is incorrect!");
    }

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

    return response(res, {
      code: 201,
      success: true,
      message: "Code is valid. You can proceed with the reset.",
      content: {
        accessToken,
        data,
      },
    });
  } catch (error) {
    return exceptionResponse(res, error);
  }
};
