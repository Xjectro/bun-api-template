import { type Request, type Response } from "express";
import { response, exceptionResponse } from "../api/response";
import { updateStates } from "../utils/helpers";
import { User } from "../database/models/user.model";
import { Connection } from "../database/models/connection.model";
import { NotFoundError } from "../utils/exceptions";

export default class UsersController {
  public me = {
    index: (_: Request, res: Response) => {
      try {
        const user = res.locals.user;
        return response(res, {
          code: 201,
          success: true,
          message: "Successfully get user",
          data: user,
        });
      } catch (error: any) {
        return exceptionResponse(res, error);
      }
    },
    update: async (req: Request, res: Response) => {
      try {
        const user = res.locals.user;
        const { ...rest } = req.body;

        delete rest.user_id;
        delete rest.createdAt;
        delete rest.updatedAt;
        delete rest.email;

        const state = updateStates(rest);

        await User.findOneAndUpdate(
          { email: user.email },
          {
            $set: { ...state },
          },
        );

        return response(res, {
          code: 201,
          success: true,
          message: "Successfully update user",
        });
      } catch (error: any) {
        return exceptionResponse(res, error);
      }
    },
    connections: async (req: Request, res: Response) => {
      try {
        const user = res.locals.user;

        const connections = await Connection.find({ user: user._id }).select(
          "data",
        );
        if (connections.length === 0) {
          throw new NotFoundError("No connections found for the user");
        }

        const formattedConnections = connections.map((connection) => ({
          id: connection.data.name,
          name: connection.data.name,
          username: connection.data.username,
        }));

        return response(res, {
          code: 201,
          success: true,
          data: formattedConnections,
        });
      } catch (error: any) {
        return exceptionResponse(res, error);
      }
    },
  };
}
