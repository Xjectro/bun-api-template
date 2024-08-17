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

export interface TransactionsType {
  user_id: string;
  action: string;
  code?: string;
  ref?: string;
  expiresAt: Date;
}

export interface UserType extends mongoose.Document {
  user_id: string;
  access_token: string;
  refresh_token: string;

  transactions: TransactionsType[];

  email: string;
  password: string;
  role: UserRole;

  firstName: string;
  lastName: string;
  avatarURL: string;

  createdAt: Date;
  updatedAt: Date;

  checkPassword: (password: string) => Promise<boolean>;
}

const userSchema: mongoose.Schema<UserType> = new Schema<UserType>(
  {
    user_id: String,
    access_token: String,
    refresh_token: String,
    transactions: Array,
    email: String,
    password: String,
    role: String,
    firstName: String,
    lastName: String,
    avatarURL: String,
  },
  { timestamps: true, versionKey: false },
);

userSchema.pre<UserType>("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
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
