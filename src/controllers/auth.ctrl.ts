import { Request, Response } from "express";
import {
  response,
  exceptionResponse,
} from "../infrastructure/commons/response";
import { createUser } from "../services/dbServices";
import { sendEmail } from "../infrastructure/transport/email";
import { generateCode } from "../utils/auth/code";
import {
  UnauthorizedError,
  DuplicatedDataError,
} from "../infrastructure/commons/exceptions";
import { TransactionsType, User } from "../database/models/users";

export default class AuthController {
  public async login(req: Request, res: Response) {
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
            transactions: {
              code: verificationCode,
              action: "login",
              expiresAt: new Date(Date.now() + 180 * 1000),
            },
          },
        },
        { new: true },
      ).exec();

      await sendEmail({
        to: user.email,
        subject: `${user.firstName} Your login code`,
        html: `<section><h3>Login Code</h3><p>This is your login code <strong><u>${verificationCode}</u></strong></p></section>`,
      });

      return response(res, {
        code: 201,
        success: true,
        message: "Successfully send verification code",
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  }

  public async register(req: Request, res: Response) {
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
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  }

  public async forgotPassword(req: Request, res: Response) {
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
            transactions: {
              code,
              ref: updatedRef,
              action: "forgotPassword",
              expiresAt: new Date(Date.now() + 180 * 1000),
            },
          },
        },
        { new: true },
      ).exec();

      await sendEmail({
        to: user.email,
        subject: "Password reset link",
        html: `<section><h3>Forgot Password</h3><p>This is your password <a href=${updatedRef}><strong><u>reset link</u></strong></a></p></section>`,
      });

      return response(res, {
        code: 201,
        success: true,
        message: "Password reset request completed!",
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  }

  public async refreshPassword(req: Request, res: Response) {
    try {
      const { newPassword } = req.body;
      const { id } = res.locals.user;

      const user = await User.findOne({ user_id: id }).exec();
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
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  }

  public async code(req: Request, res: Response) {
    try {
      const { code, action } = req.body;

      const user = await User.findOne({ "transactions.code": code }).exec();
      if (!user) {
        throw new UnauthorizedError("Code is incorrect!");
      }

      const request = user.transactions.filter(
        (req: TransactionsType) => req.code === code,
      )[0];

      if (
        request.action !== action &&
        (!request || new Date(request.expiresAt) <= new Date())
      ) {
        throw new UnauthorizedError(
          "Code is expired or action does not match!",
        );
      }

      const data: any = {};

      data.expiresAt = request.expiresAt;
      data.access_token = user.access_token;

      if (action == "login") {
        data.refresh_token = user.refresh_token;
      }

      return response(res, {
        code: 201,
        success: true,
        message: "Code is valid. You can proceed with the reset.",
        data,
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  }
}
