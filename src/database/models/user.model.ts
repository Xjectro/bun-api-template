import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface UserType extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  user_id: string;
  username: string;
  description: string;
  firstName: string;
  lastName: string;
  avatarURL: string;
  bannerURL: string;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: mongoose.Schema<UserType> = new Schema<UserType>(
  {
    user_id: {
      type: String,
      unique: true,
      required: [true, 'User ID is required'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    description: {
      type: String,
      required: false,
      default: 'hello!',
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    avatarURL: {
      type: String,
    },
    bannerURL: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.plugin(uniqueValidator, { message: '{PATH} should be unique.' });

export const User = mongoose.model<UserType>('user', userSchema);
