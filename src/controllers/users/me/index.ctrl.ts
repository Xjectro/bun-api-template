import { type Request, type Response } from 'express';
import { exceptionResponse, response } from '../../../api/commons/response';
import { DuplicatedDataError, NotFoundError } from '../../../api/commons/exceptions';
import { User } from '../../../database/models/user.model';
import { updateStates } from '../../../services/db.services';
import { Connection } from '../../../database/models/connection.model';

export default class UsersMeController {
  index = (_: Request, res: Response) => {
    try {
      const data = res.locals.user;
      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully get user',
        data,
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user;

      const { user_id, createdAt, updatedAt, email, ...rest } = req.body;

      if (rest.username) {
        const existingUser = await User.findOne({
          username: rest.username,
        }).exec();
        if (existingUser) {
          throw new DuplicatedDataError('Username already exists!');
        }
      }

      const state = updateStates(rest);

      await User.updateOne({ _id: user._id }, { $set: state }, { upsert: true }).exec();

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully updated user',
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };

  connections = async (_: Request, res: Response) => {
    try {
      const user = res.locals.user;

      const connections = await Connection.find({ user }).select('data type').exec();

      if (connections.length === 0) {
        throw new NotFoundError('No connections found for the user');
      }

      const data = connections.map((connection) => ({
        id: connection.id,
        name: connection.data.name,
        username: connection.data.username,
        type: connection.type,
      }));

      return response(res, {
        code: 200,
        success: true,
        message: 'Connections were pulled successfully',
        data,
      });
    } catch (error) {
      return exceptionResponse(res, error);
    }
  };
}
