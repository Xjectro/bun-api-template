import { type Request, type Response } from "express";
import { exceptionResponse, response } from "../../api/response";
import UsersHelpers from "./helpers.utils";

export default class UsersController {
  private helpers: UsersHelpers;

  constructor() {
    this.helpers = new UsersHelpers();
  }

  index = (_: Request, res: Response) => {
    try {
      const data = res.locals.user;
      return response(res, {
        code: 200,
        success: true,
        message: "Successfully get user",
        data,
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user;
      const updateData = { ...req.body };

      await this.helpers.validateAndUpdateUser(user, updateData);

      return response(res, {
        code: 200,
        success: true,
        message: "Successfully updated user",
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };

  connections = async (_: Request, res: Response) => {
    try {
      const user = res.locals.user;

      const data = await this.helpers.getUserConnections(user._id);

      return response(res, {
        code: 200,
        success: true,
        message: "Connections were pulled successfully",
        data,
      });
    } catch (error) {
      return exceptionResponse(res, error);
    }
  };
}
