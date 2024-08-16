import { Request, Response } from "express";
import { response, exceptionResponse } from "../utils/commons/response";
import { createUser } from "../services/dbServices";
import { EmailClient } from "../clients/Email";
import { generateCode } from "../utils/auth/code";
import {
  UnauthorizedError,
  DuplicatedDataError,
} from "../utils/commons/exceptions";
import { User } from "../database/models/users";

const emailClient = new EmailClient();

export const authLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();
    if (!user || !(await user.checkPassword(password))) {
      throw new UnauthorizedError("Email or password is incorrect!");
    }

    const verificationCode = generateCode({ length: 5 });

    await User.findOneAndUpdate(
      { email },
      {
        $push: {
          requests: {
            code: verificationCode,
            action: "login",
            expiresAt: new Date(Date.now() + 180 * 1000),
          },
        },
      },
      { new: true },
    ).exec();

    await emailClient.sendEmail({
      to: user.email,
      subject: `${user.firstName} Your login code`,
      html: `<section><h3>Login Code</h3><p>This is your login code <strong><u>${verificationCode}</u></strong></p></section>`,
    });

    return response(res, {
      code: 201,
      success: true,
      message: "Successfully send verification code",
    });
  } catch (error) {
    return exceptionResponse(res, error);
  }
};

export const authRegister = async (req: Request, res: Response) => {
  try {
    const { email, ...rest } = req.body;

    const user = await User.findOne({ email }).exec();
    if (user) {
      throw new DuplicatedDataError("User already exists!");
    }

    await createUser({ email, ...rest });

    return response(res, {
      code: 201,
      success: true,
      message: "Successfully created user!",
    });
  } catch (error) {
    return exceptionResponse(res, error);
  }
};

export const authForgotPassword = async (req: Request, res: Response) => {
  try {
    const { email, ref } = req.body;

    const user = await User.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedError("Email is incorrect!");
    }

    const code = generateCode({ length: 24 });
    const updatedRef = ref.replace("{code}", code);

    await User.findOneAndUpdate(
      { email },
      {
        $push: {
          requests: {
            code,
            ref: updatedRef,
            action: "forgotPassword",
            expiresAt: new Date(Date.now() + 180 * 1000),
          },
        },
      },
      { new: true },
    ).exec();

    await emailClient.sendEmail({
      to: user.email,
      subject: "Password reset link",
      html: `<section><h3>Forgot Password</h3><p>This is your password <a href=${updatedRef}><strong><u>reset link</u></strong></a></p></section>`,
    });

    return response(res, {
      code: 201,
      success: true,
      message: "Password reset request completed!",
    });
  } catch (error) {
    return exceptionResponse(res, error);
  }
};

export const authRefreshPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;

    const user = await User.findOne({ email: res.locals.user.email }).exec();
    if (!user) {
      throw new UnauthorizedError("Email is incorrect!");
    }
    if (await user.checkPassword(newPassword)) {
      throw new UnauthorizedError("Password is the same as before!");
    }

    user.password = newPassword;
    await user.save();

    return response(res, {
      code: 201,
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    return exceptionResponse(res, error);
  }
};

export const authVerifyRequestCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    const user = await User.findOne({ "requests.code": code }).exec();
    if (!user) {
      throw new UnauthorizedError("Code is incorrect!");
    }

    const request = user.requests.find((req) => req.code === code);
    if (!request || new Date(request.expiresAt) <= new Date()) {
      throw new UnauthorizedError("Code is expired or action does not match!");
    }

    return response(res, {
      code: 201,
      success: true,
      message: "Code is valid. You can proceed with the reset.",
      content: {
        expiresAt: request.expiresAt,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      },
    });
  } catch (error) {
    return exceptionResponse(res, error);
  }
};
