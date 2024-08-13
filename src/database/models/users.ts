import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

export enum UserRole {
    MANAGER = "MANAGER",
    DEVELOPER = "DEVELOPER",
    TESTER = "TESTER",
    RESEARCHE = "RESEARCHER",
    USER = "USER",
}

export interface Request {
    action: string;
    code?: string;
    ref?: string;
    expiresAt?: Date;
}

export interface UserType extends mongoose.Document {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    avatarURL: string;
    requests: Request[];
    role: UserRole;
    checkPassword: (password: string) => Promise<boolean>;
}

const userSchema: mongoose.Schema<UserType> = new Schema<UserType>(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 20,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxLength: 50,
        },
        avatarURL: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minlength: 5,
            maxLength: 50,
        },
        password: {
            type: String,
            required: true,
            minLength: 7,
            maxLength: 20,
        },
        requests: [
            {
                action: { type: String, required: true },
                code: { type: String, required: false },
                ref: { type: String, required: false },
                expiresAt: { type: Date, default: new Date() },
            },
        ],
        role: {
            type: String,
            required: true,
            enum: Object.values(UserRole),
        },
    },
    { timestamps: true }
);

userSchema.pre<UserType>("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        return next(error);
    }

    next();
});

userSchema.methods.checkPassword = async function (
    password: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(password, this.password);
    } catch {
        return false;
    }
};

export const User = mongoose.model("user", userSchema);
