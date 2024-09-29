import { type Request, type Response } from 'express';
import { exceptionResponse, response } from '../../api/commons/response';
import { checkTransaction, createTransaction, createUser } from '../../services/db.services';
import AuthHelpers from './helpers.utils';
import { generateJwt } from '../../utils/auth/jwt';
import { UnauthorizedError, DuplicatedDataError } from '../../api/commons/exceptions';
import { UserAuth } from '../../database/models/userAuth.model';
import { sendEmail } from '../../api/transport/email';
import { User } from '../../database/models/user.model';
import { createHtmlTemplate } from '../../utils/helpers';

export default class AuthController {
  private helpers: AuthHelpers;

  constructor() {
    this.helpers = new AuthHelpers();
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const userAuth = await UserAuth.findOne({ email }).populate('user').exec();

      if (!userAuth || !(await userAuth.comparePassword(password))) {
        throw new UnauthorizedError('Email or password is incorrect!');
      }

      let data: any = {};
      if (userAuth.tfa) {
        const { code } = await createTransaction({ user: userAuth.user._id, action: 'login' });

        const html = await createHtmlTemplate('auth-login', {
          code,
        });

        await sendEmail({
          to: email,
          subject: `${userAuth.user.firstName} Your login code`,
          html,
        });
      } else {
        data.access_token = generateJwt(
          {
            id: userAuth.user,
          },
          30 * 24 * 60 * 60,
        );
        data.refresh_token = userAuth.refresh_token;
      }

      return response(res, {
        code: 201,
        success: true,
        message: 'Successfully',
        data,
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const { email, username, ...rest } = req.body;

      const user = await User.findOne({ username }).exec();
      if (user) {
        throw new DuplicatedDataError('User already exists!');
      }

      const userAuth = await UserAuth.findOne({ email }).exec();
      if (userAuth) {
        throw new DuplicatedDataError('User already exists!');
      }

      await createUser({ email, username, ...rest });

      return response(res, {
        code: 201,
        success: true,
        message: 'Successfully created user!',
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email, ref } = req.body;

      const userAuth = await UserAuth.findOne({ email }).exec();
      if (!userAuth) {
        throw new UnauthorizedError('Email is incorrect!');
      }

      const { ref: href } = (await createTransaction({
        user: userAuth.user,
        action: 'forgot_password',
        ref,
        format: 'jwt',
      })) as { code: string; ref: string };

      const html = await createHtmlTemplate('auth-forgotPassword', {
        href,
      });

      await sendEmail({
        to: email,
        subject: 'Password reset link',
        html,
      });

      return response(res, {
        code: 201,
        success: true,
        message: 'Password reset request completed!',
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
        throw new UnauthorizedError('User not found!');
      }
      if (await userAuth.comparePassword(newPassword)) {
        throw new UnauthorizedError('Password is the same as before!');
      }

      userAuth.password = newPassword;
      await userAuth.save();

      return response(res, {
        code: 201,
        success: true,
        message: 'Password updated successfully!',
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };

  code = async (req: Request, res: Response) => {
    try {
      const { code, action } = req.body;

      const transaction = await checkTransaction({ code, action });

      const data: any = {
        expiresAt: transaction.expiresAt,
        access_token: generateJwt(
          {
            id: transaction.user._id,
          },
          30 * 24 * 60 * 60,
        ),
      };

      if (action === 'login') {
        const userAuth = await UserAuth.findOne({ user: transaction.user._id });
        data.refresh_token = userAuth?.refresh_token;
      }

      return response(res, {
        code: 201,
        success: true,
        message: 'Code is valid. You can proceed with the reset.',
        data,
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };

  twoFactor = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user;
      const { enabled } = req.body;

      const userAuth = await UserAuth.findOne({ user: user._id });

      if (!userAuth) return;

      userAuth.tfa = enabled;

      await userAuth.save();

      return response(res, {
        code: 201,
        success: true,
        message: 'Successfully update two factor.',
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };
}
