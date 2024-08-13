import { type Request, type Response } from "express";
import { DbService } from "../services/db";
import { EmailService } from "../services/email";
import { generateAccessToken, generateCode } from "../utils/auth";
import {
    UnauthorizedError,
    DuplicatedDataError,
} from "../utils/commons/exceptions";
import { exceptionResponse, response } from "../utils/commons/response";
import { User } from "../database/models/users";

const dbService = new DbService();
const emailService = new EmailService();

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.checkPassword(password))) {
            throw new UnauthorizedError("Email or password is incorrect!");
        }

        const payload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarURL: user.avatarURL,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        const accessToken = generateAccessToken(payload);
        const verificationCode = generateCode({ length: 5 });

        await emailService.sendEmail({
            to: user.email,
            subject: `${user.firstName}, your login code`,
            html: `<section><h3>Login Code</h3><p>This is your login code <strong><u>${verificationCode}</u></strong></p></section>`,
        });

        return response(res, {
            code: 201,
            success: true,
            message: `Successfully login user`,
            content: { accessToken, verificationCode },
        });
    } catch (error) {
        return exceptionResponse(res, error);
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, ...rest } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new DuplicatedDataError("User already exists!");
        }

        await dbService.create.user({ email, ...rest });

        return response(res, {
            code: 201,
            success: true,
            message: "Successfully created user!",
        });
    } catch (error) {
        return exceptionResponse(res, error);
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email, ref } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw new UnauthorizedError("Email is incorrect!");
        }

        const code = generateCode({ length: 24 });
        const updatedRef = ref + code;

        await User.findOneAndUpdate(
            { email },
            {
                $push: {
                    requests: {
                        code,
                        ref: updatedRef,
                        action: "forgotPassword",
                        expiresAt: new Date(Date.now() + 180 * 1000),
                    },
                },
            }
        ).exec();

        await emailService.sendEmail({
            to: user.email,
            subject: `${user.firstName}, Password reset link`,
            html: `<section><h3>Forgot Password</h3><p>This is your password <a href=${updatedRef}><strong><u>reset link</u></strong></a></p></section>`,
        });

        return response(res, {
            code: 201,
            success: true,
            message: "Successfully completed password reset request!",
        });
    } catch (error) {
        return exceptionResponse(res, error);
    }
};

export const refreshPassword = async (req: Request, res: Response) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw new UnauthorizedError("Email is incorrect!");
        }
        if (await user.checkPassword(newPassword)) {
            throw new UnauthorizedError("Password is the same as before!");
        }

        user.password = newPassword;
        await user.save();

        return response(res, {
            code: 201,
            success: true,
            message: "Successfully completed password refresh!",
        });
    } catch (error) {
        return exceptionResponse(res, error);
    }
};

export const verifyRequestCode = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;

        const user = await User.findOne({ "requests.code": code });
        if (!user) {
            throw new UnauthorizedError("Code is incorrect!");
        }

        const request = user.requests.find((req) => req.code === code);
        if (!request) {
            throw new UnauthorizedError("Code is incorrect!");
        }

        const valid = new Date(request.expiresAt) > new Date();

        if (valid) {
            return response(res, {
                code: 201,
                success: true,
                message: "Code is valid. You can proceed with the reset.",
                content: { email: user.email, expiresAt: request.expiresAt },
            });
        } else {
            throw new UnauthorizedError("Code is expired or action does not match!");
        }
    } catch (error) {
        return exceptionResponse(res, error);
    }
};
