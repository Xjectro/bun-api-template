import mongoose from "mongoose";
import bcrypt from "bcrypt";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface UserAuthType extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  refresh_token: string;
  email: string;
  password: string;
  role: UserRole;
  comparePassword: (password: string) => Promise<boolean>;
}

const userAuthSchema: mongoose.Schema<UserAuthType> = new Schema<UserAuthType>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User ID is required"],
    },
    refresh_token: {
      type: String,
      required: [true, "Refresh token is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true, versionKey: false },
);

userAuthSchema.plugin(uniqueValidator, { message: "{PATH} should be unique." });

userAuthSchema.pre<UserAuthType>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    return next(error);
  }

  next();
});

userAuthSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch {
    return false;
  }
};

export const UserAuth = mongoose.model<UserAuthType>(
  "userAuth",
  userAuthSchema,
);
