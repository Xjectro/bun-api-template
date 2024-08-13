import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface PostType extends mongoose.Document {
    postId: string;
    authorId: string;
    title: string;
    content: string;
    tags: string[];
    comments: {
        authorId: string;
        content: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const postSchema: mongoose.Schema<PostType> = new Schema<PostType>(
    {
        postId: {
            type: String,
            required: true,
        },
        authorId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        tags: {
            type: ["String"],
            default: [""],
        },
        comments: {
            type: [
                {
                    authorId: String,
                    content: String,
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
);

export const Post = mongoose.model("post", postSchema);
