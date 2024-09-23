import { type Request, type Response } from "express";
import { exceptionResponse, response } from "../../../api/response";
import ConnectionsProviders from "./providers.utils";
import { Connection } from "../../../database/models/connection.model";
import { NotFoundError } from "../../../utils/exceptions";

export default class UsersConnectionsController {
  private providers: ConnectionsProviders = new ConnectionsProviders();

  discord = async (req: Request, res: Response) => {
    try {
      const code = req.query.code as string;

      const data = await this.providers.discord(res.locals.user._id, code);

      return response(res, {
        code: 201,
        success: true,
        message: "Successfully connected to Discord",
        data,
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };

  disconnect = async (req: Request, res: Response) => {
    try {
      const { type } = req.query;

      const connection = await Connection.findOne({
        user: res.locals.user._id,
        type,
      });

      if (!connection) throw new NotFoundError(`No link named ${type} found`);

      await connection.deleteOne();

      return response(res, {
        code: 201,
        success: true,
        message: "Disconnected successfully.",
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };
}
