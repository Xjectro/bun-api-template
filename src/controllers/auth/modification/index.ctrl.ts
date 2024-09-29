import { type Request, type Response } from 'express';
import { exceptionResponse, response } from '../../../api/commons/response';
import { UnauthorizedError } from '../../../api/commons/exceptions';
import { Auth } from '../../../database/models/auth.model';

export default class AuthModificationController {
  email = async (req: Request, res: Response) => {
    try {
      const { newEmail } = req.body;
      const user = res.locals.user;

      const auth = await Auth.findOne({ user: user._id });

      if (!auth) {
        throw new UnauthorizedError('User not found!');
      }

      const existing = await Auth.findOne({ email: newEmail }).exec();

      if (existing) {
        throw new UnauthorizedError('There is such an email!');
      }

      auth.email = newEmail;
      await auth.save();

      return response(res, {
        code: 201,
        success: true,
        message: 'Email updated successfully!',
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };

  password = async (req: Request, res: Response) => {
    try {
      const { newPassword, currentPassword } = req.body;
      const user = res.locals.user;

      const auth = await Auth.findOne({ user: user._id }).exec();

      if (!auth) {
        throw new UnauthorizedError('User not found!');
      }

      if (!(await auth.comparePassword(currentPassword))) {
        throw new UnauthorizedError('Your current password is incorrect!');
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
