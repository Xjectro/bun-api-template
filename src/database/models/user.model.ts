import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface UserType extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  auth: any;
  user_id: string;
  username: string;
  description: string;
  firstName: string;
  lastName: string;
  avatarURL: string;
  bannerURL: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: mongoose.Schema<UserType> = new Schema<UserType>(
  {
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
      required: false,
    },
    user_id: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: "test",
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    bannerURL: {
      type: String,
      required: false,
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);

export const User = mongoose.model<UserType>("user", userSchema);