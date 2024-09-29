import { type Request, type Response } from 'express';
import { exceptionResponse, response } from '../../api/commons/response';
import { createUser } from '../../services/db.service';
import AuthHelpers from './helpers.utils';
import { generateJWT } from '../../utils/modules/jwt';
import { UnauthorizedError, DuplicatedDataError } from '../../api/commons/exceptions';
import { Auth } from '../../database/models/auth.model';
import { sendEmail } from '../../services/transport.service';
import { User } from '../../database/models/user.model';
import { createHtmlTemplate } from '../../utils/helpers';
import { Tfa } from '../../database/models/tfa.model';
import AuthTfaController from './tfa/index.ctrl';

export default class AuthController {
  private helpers: AuthHelpers;
  tfa = new AuthTfaController()

  constructor() {
    this.helpers = new AuthHelpers();
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const auth = await Auth.findOne({ email }).populate('user').exec();

      if (!auth || !(await auth.comparePassword(password))) {
        throw new UnauthorizedError('Email or password is incorrect!');
      }

      let data: any = {};
      if (auth.tfa) {
        const { usage_code } = await Tfa.createTfa({ user: auth.user._id, interaction: 'login' });

        const html = await createHtmlTemplate('auth-login', {
          code: usage_code,
        });

        await sendEmail({
          to: email,
          subject: `${auth.user.firstName} Your login code`,
          html,
        });
      } else {
        data.access_token = generateJWT(
          {
            id: auth.user._id,
          },
          30 * 24 * 60 * 60,
        );
        data.refresh_token = auth.refresh_token;
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

      const userAuth = await Auth.findOne({ email }).exec();
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

      const auth = await Auth.findOne({ email }).exec();
      if (!auth) {
        throw new UnauthorizedError('Email is incorrect!');
      }

      const { usage_code } = await Tfa.createTfa({
        user: auth.user._id,
        interaction: 'forgot_password',
        format: 'jwt',
      })

      const html = await createHtmlTemplate('auth-forgot_password', {
        href: ref + `${usage_code}`,
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

      const auth = await Auth.findOne({ user: user._id }).exec();

      if (!auth) {
        throw new UnauthorizedError('User not found!');
      }

      if (await auth.comparePassword(newPassword)) {
        throw new UnauthorizedError('Password is the same as before!');
      }

      auth.password = newPassword;
      await auth.save();

      return response(res, {
        code: 201,
        success: true,
        message: 'Password updated successfully!',
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };
}
