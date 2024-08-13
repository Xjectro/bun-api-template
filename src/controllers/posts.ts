import { Request, Response } from "express";
import { DbService } from "../services/db";
import { Post } from "../database/models/posts";
import { response, exceptionResponse } from "../utils/commons/response";

const dbService = new DbService();

export const createPost = async (req: Request, res: Response) => {
    try {
        const { ...rest } = req.body;

        await dbService.create.post(rest);

        return response(res, {
            code: 201,
            success: true,
            message: "Successfully create post",
        })
    } catch (error) {
        return exceptionResponse(res, error)
    }
}

export const updatePost = async (req: Request, res: Response) => {
    try {
        const { postId, ...rest } = req.body;

        await Post.findOneAndUpdate({ postId }, { $set: { ...rest } })

        return response(res, {
            code: 201,
            success: true,
            message: "Successfully update post",
        })
    } catch (error) {
        return exceptionResponse(res, error)
    }
}

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.body;

        await Post.deleteOne({ postId })

        return response(res, {
            code: 201,
            success: true,
            message: "Successfully delete post",
        })
    } catch (error) {
        return exceptionResponse(res, error)
    }
}

export const sendPostComment = async (req: Request, res: Response) => {
    try {
        const { postId, ...rest } = req.body;

        await Post.findOneAndUpdate({ postId }, { $push: { comments: rest } })

        return response(res, {
            code: 201,
            success: true,
            message: "Successfully send comment post",
        })
    } catch (error) {
        return exceptionResponse(res, error)
    }
}

export const deletePostComment = async (req: Request, res: Response) => {
    try {
        const { postId, ...rest } = req.body;

        await Post.findOneAndUpdate({ postId }, { $pull: { comments: rest } })

        return response(res, {
            code: 201,
            success: true,
            message: "Successfully delete comment post",
        })
    } catch (error) {
        return exceptionResponse(res, error)
    }
}