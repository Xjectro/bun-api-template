import { type Request, type Response } from "express";
import { response, exceptionResponse } from "../api/response";
import { createUser } from "../services/db.services";
import { sendEmail } from "../utils/transport/email";
import { generateCode } from "../utils/auth/code";
import { UnauthorizedError, DuplicatedDataError } from "../utils/exceptions";
import { User } from "../database/models/user.model";
import { UserAuth } from "../database/models/userAuth.model";
import { Transaction } from "../database/models/transaction.model";
import { generateAccessToken } from "../utils/auth/accessToken";

export default class AuthController {
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const userAuth = await UserAuth.findOne({ email }).exec();
      if (!userAuth || !(await userAuth.comparePassword(password))) {
        throw new UnauthorizedError("Email or password is incorrect!");
      }

      const user = await User.findById(userAuth.user).exec();
      if (!user) {
        throw new UnauthorizedError("Email or password is incorrect!");
      }

      const verificationCode = generateCode({ length: 5 });

      await Transaction.create({
        user: userAuth.user,
        action: "login",
        code: verificationCode,
        expiresAt: new Date(Date.now() + 180 * 1000),
      });

      await sendEmail({
        to: userAuth.email,
        subject: `${user.firstName} Your login code`,
        html: `<section><h3>Login Code</h3><p>This is your login code <strong><u>${verificationCode}</u></strong></p></section>`,
      });

      return response(res, {
        code: 201,
        success: true,
        message: "Successfully sent verification code",
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  }

  public async register(req: Request, res: Response) {
    try {
      const { email, username, ...rest } = req.body;
      
      const user = await User.findOne({ username }).exec();

      if (user) {
        throw new DuplicatedDataError("User already exists!");
      }

      const userAuth = await UserAuth.findOne({ email }).exec();

      if (userAuth) {
        throw new DuplicatedDataError("User already exists 2!");
      }

      await createUser({ email, username, ...rest });

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

      const userAuth = await UserAuth.findOne({ email }).exec();
      if (!userAuth) {
        throw new UnauthorizedError("Email is incorrect!");
      }

      const code = generateCode({ length: 24 });
      const updatedRef = ref.replace("{code}", code);

      await Transaction.create({
        user: userAuth.user,
        action: "forgotPassword",
        code,
        ref: updatedRef,
        expiresAt: new Date(Date.now() + 180 * 1000),
      });

      await sendEmail({
        to: userAuth.email,
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

      const userAuth = await UserAuth.findById(id).exec();
      if (!userAuth) {
        throw new UnauthorizedError("User not found!");
      }
      if (await userAuth.comparePassword(newPassword)) {
        throw new UnauthorizedError("Password is the same as before!");
      }

      userAuth.password = newPassword;
      await userAuth.save();

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

      const transaction = await Transaction.findOne({ code }).exec();
      if (!transaction) {
        throw new UnauthorizedError("Code is incorrect!");
      }

      const currentTime = new Date();
      if (
        transaction.action !== action ||
        transaction.expiresAt <= currentTime
      ) {
        throw new UnauthorizedError(
          "Code is expired or action does not match!",
        );
      }

      const userAuth = await UserAuth.findOne({
        user: transaction.user,
      }).exec();
      if (!userAuth) {
        throw new UnauthorizedError("User not found!");
      }

      const data: any = {
        expiresAt: transaction.expiresAt,
        access_token: generateAccessToken({
          id: userAuth.user,
          email: userAuth.email,
        }),
      };

      if (action === "login") {
        data.refresh_token = userAuth.refresh_token;
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
