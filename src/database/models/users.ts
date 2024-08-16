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

export interface RequestType {
  action: string;
  code?: string;
  ref?: string;
  expiresAt?: Date;
}

export interface UserType extends mongoose.Document {
  userId: string;
  accessToken: string;
  refreshToken: string;
  email: string;
  password: string;
  requests: RequestType[];
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  avatarURL: string;

  checkPassword: (password: string) => Promise<boolean>;
}

const userSchema: mongoose.Schema<UserType> = new Schema<UserType>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 50,
      match: [/.+@.+\..+/, "Invalid email address."],
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      maxlength: 20,
    },
    requests: [
      {
        action: { type: String, required: true },
        code: { type: String },
        ref: { type: String },
        expiresAt: { type: Date },
      },
    ],
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
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
      maxlength: 50,
    },
    avatarURL: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true, versionKey: false },
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
  password: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch {
    return false;
  }
};

export const User = mongoose.model("users", userSchema);
