import { type Request, type Response } from 'express';
import { exceptionResponse, response } from '../../../api/commons/response';
import { UnauthorizedError } from '../../../api/commons/exceptions';
import { UserAuth } from '../../../database/models/userAuth.model';

export default class AuthModificationController {
  password = async (req: Request, res: Response) => {
    try {
      const { newPassword, currentPassword } = req.body;
      const user = res.locals.user;

      const userAuth = await UserAuth.findOne({ user: user._id }).exec();

      if (!userAuth) {
        throw new UnauthorizedError('User not found!');
      }

      if (!(await userAuth.comparePassword(currentPassword))) {
        throw new UnauthorizedError('Your current password is incorrect!');
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

  email = async (req: Request, res: Response) => {
    try {
      const { newEmail } = req.body;
      const user = res.locals.user;

      const userAuth = await UserAuth.findOne({ user: user._id });

      if (!userAuth) {
        throw new UnauthorizedError('User not found!');
      }

      const existing = await UserAuth.findOne({ email: newEmail }).exec();

      if (existing) {
        throw new UnauthorizedError('There is such an email!');
      }

      userAuth.email = newEmail;
      await userAuth.save();

      return response(res, {
        code: 201,
        success: true,
        message: 'Email updated successfully!',
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };
}
