import { type Request, type Response } from 'express';
import { exceptionResponse, response } from '../../../api/commons/response';
import { NotFoundError } from '../../../api/commons/exceptions';
import { User } from '../../../database/models/user.model';

export default class UsersPublicController {
  _user_id = async (req: Request, res: Response) => {
    try {
      const { user_id } = req.params;

      if (!user_id) {
        throw new NotFoundError('Could not find user with id');
      }

      const user = await User.findOne({ user_id }).select(
        'username avatarURL user_id description createdAt updatedAt bannerURL',
      );

      if (!user) {
        throw new NotFoundError('Could not find user with id 2');
      }

      const { _id, id: _, user_id: id, ...data } = user.toObject({ virtuals: true });

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully get user',
        data: { ...data, id },
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };
}
