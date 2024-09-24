import { type Request, type Response } from "express";
import { exceptionResponse, response } from "../../api/commons/response";
import { createUser } from "../../services/db.services";
import AuthHelpers from "./helpers.utils";
import { generateAccessToken } from "../../utils/auth/accessToken";
import { UnauthorizedError } from "../../api/commons/exceptions";
import { UserAuth } from "../../database/models/userAuth.model";
import { sendEmail } from "../../api/transport/email";
import { Transaction } from "../../database/models/transaction.model";
import { generateCode } from "../../utils/auth/code";
import { readFile } from "fs/promises";
import path from "path";

export default class AuthController {
  private helpers: AuthHelpers;

  constructor() {
    this.helpers = new AuthHelpers();
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      await this.helpers.validateCredentials(email, password);
      const user = await this.helpers.getUser(email);

      const verificationCode = generateCode({ length: 5 });
      await Transaction.create({
        user: user._id,
        action: "login",
        code: verificationCode,
        expiresAt: new Date(Date.now() + 180 * 1000),
      });

      const html = await readFile(
        path.join(
          __dirname,
          "..",
          "..",
          "..",
          "templates",
          "html",
          "auth",
          "login.html",
        ),
        "utf-8",
      );

      await sendEmail({
        to: email,
        subject: `${user.firstName} Your login code`,
        html: html.replace("{code}", verificationCode),
      });

      return response(res, {
        code: 201,
        success: true,
        message: "Successfully sent verification code.",
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const { email, username, ...rest } = req.body;
      await this.helpers.checkUserExists(username, email);
      await createUser({ email, username, ...rest });

      return response(res, {
        code: 201,
        success: true,
        message: "Successfully created user!",
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email, ref } = req.body;
      const userAuth = await this.helpers.getUserAuth(email);

      const code = generateCode({ length: 24 });
      const updatedRef = ref.replace("[code]", code);

      await Transaction.create({
        user: userAuth.user,
        action: "forgotPassword",
        code,
        ref: updatedRef,
        expiresAt: new Date(Date.now() + 180 * 1000),
      });

      const html = await readFile(
        path.join(
          __dirname,
          "..",
          "..",
          "..",
          "templates",
          "html",
          "auth",
          "forgotPassword.html",
        ),
        "utf-8",
      );

      await sendEmail({
        to: email,
        subject: "Password reset link",
        html: html.replace("{href}", updatedRef),
      });

      return response(res, {
        code: 201,
        success: true,
        message: "Password reset request completed!",
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };

  refreshPassword = async (req: Request, res: Response) => {
    try {
      const { newPassword } = req.body;
      const user = res.locals.user;

      const userAuth = await UserAuth.findOne({ user: user._id }).exec();

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
  };

  code = async (req: Request, res: Response) => {
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
  };
}
