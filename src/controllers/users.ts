import { Request, Response } from "express";
import { response, exceptionResponse } from "../utils/commons/response";

export const me = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;
        return response(res, {
            code: 201,
            success: true,
            message: "Successfully get user",
            content: user,
        });
    } catch (error) {
        return exceptionResponse(res, error);
    }
};