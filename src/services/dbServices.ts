import { User, UserType } from "../database/models/users";
import { generateAccessToken } from "../utils/auth/accessToken";
import { generateRefreshToken } from "../utils/auth/refreshToken";
import { v4 as uuidV4 } from "uuid";
import { InternalServerError } from "../utils/commons/exceptions";

export const updateStates = (params: any) => {
  const editedObj = Object.entries(params).map(([key, value]) => ({
    [key]: value,
  }));
  const obj = {};
  editedObj.forEach((item) => {
    const key = Object.keys(item)[0];
    const value = item[key];
    obj[key] = value;
  });
  return obj;
};

export function createAvatarURL(firstName?: string, lastName?: string): string {
  const name = [firstName, lastName].filter(Boolean).join(" ");
  return `https://ui-avatars.com/api/?size=128&bold=true&uppercase=true&background=ffffff&color=000000&name=${encodeURIComponent(name)}`;
}

export async function createUser(
  userData: Partial<
    Pick<UserType, "email" | "password" | "firstName" | "lastName">
  >,
) {
  const id = uuidV4();

  const refreshToken = generateRefreshToken({ id });
  const accessToken = generateAccessToken({
    id,
    refreshToken,
    email: userData.email,
    role: "USER",
    firstName: userData.firstName,
    lastName: userData.lastName,
    avatarURL: createAvatarURL(userData.firstName, userData.lastName),
  });

  try {
    const user = new User({
      userId: id,
      accessToken: accessToken,
      refreshToken,
      email: userData.email,
      password: userData.password,
      role: "USER",
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatarURL: createAvatarURL(userData.firstName, userData.lastName),
    });
    await user.save();
  } catch (error) {
    throw new InternalServerError(
      "User creation failed: " + (error.message || error),
    );
  }
}
