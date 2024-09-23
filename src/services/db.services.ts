import mongoose from "mongoose";
import { User, UserType } from "../database/models/user.model";
import { UserAuth, UserAuthType } from "../database/models/userAuth.model";
import { generateRefreshToken } from "../utils/auth/refreshToken";
import { createAvatarURL } from "../utils/helpers";
import { v4 as uuidV4 } from "uuid";
import { Connection } from "../database/models/connection.model";

export async function createUser(
  userData: Partial<
    Pick<UserType, "firstName" | "lastName" | "username"> &
      Pick<UserAuthType, "email" | "password">
  >,
): Promise<mongoose.Types.ObjectId | any> {
  const id = uuidV4();
  const avatarURL = createAvatarURL(userData.firstName, userData.lastName);

  const user = new User({
    user_id: id,
    username: userData.username,
    firstName: userData.firstName,
    lastName: userData.lastName,
    avatarURL,
  });

  const refresh_token = generateRefreshToken({ id: user._id });

  await user.save();

  const userAuth = new UserAuth({
    user: user._id,
    email: userData.email,
    password: userData.password,
    refresh_token,
    role: "USER",
  });

  await userAuth.save();

  return user._id;
}

export async function saveConnection({
  type,
  tokens,
  data,
  user,
}: {
  type: string;
  data: object;
  tokens: { accessToken: string; refreshToken: string };
  user: string;
}) {
  const updateData = {
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    data,
  };

  return await Connection.updateOne(
    { user, type },
    { $set: updateData },
    { upsert: true },
  );
}

export const updateStates = (params: Record<string, any>) => {
  return Object.entries(params).reduce(
    (obj, [key, value]) => {
      obj[key] = value;
      return obj;
    },
    {} as Record<string, any>,
  );
};
