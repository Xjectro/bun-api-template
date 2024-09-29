import { type Request, type Response } from 'express';
import { exceptionResponse, response } from '../../api/commons/response';
import TokenHelpers from './helpers.utils';
import { generateJwt } from '../../utils/auth/jwt';
import { UnauthorizedError } from '../../api/commons/exceptions';
import { verifyJwt } from '../../utils/auth/jwt';
import { UserAuth } from '../../database/models/userAuth.model';
import { User } from '../../database/models/user.model';

export default class TokenController {
  private helpers: TokenHelpers;

  constructor() {
    this.helpers = new TokenHelpers();
  }

  public async refresh(req: Request, res: Response) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        throw new UnauthorizedError('No refresh token provided');
      }

      const decoded = verifyJwt(refresh_token);
      if (!decoded) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const id = decoded.id;

      const userAuth = await UserAuth.findOne({ user: id }).populate('user').exec();
      if (!userAuth) {
        throw new UnauthorizedError('Refresh token is incorrect or expired');
      }

      const access_token = generateJwt(
        {
          created: new Date(),
          id: userAuth.user._id,
        },
        30 * 24 * 60 * 60,
      );

      return response(res, {
        code: 201,
        success: true,
        message: 'Refresh token is valid. Access token generated.',
        data: {
          access_token,
          refresh_token,
        },
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  }
}
