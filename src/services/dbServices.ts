import { User, UserType } from "../database/models/users";
import { generateAccessToken } from "../utils/auth/accessToken";
import { generateRefreshToken } from "../utils/auth/refreshToken";
import { v4 as uuidV4 } from "uuid";

export const updateStates = (params: Record<string, any>) => {
  return Object.entries(params).reduce(
    (obj, [key, value]) => {
      obj[key] = value;
      return obj;
    },
    {} as Record<string, any>,
  );
};

export function createAvatarURL(firstName?: string, lastName?: string): string {
  const name = [firstName, lastName].filter(Boolean).join(" ");
  return `https://ui-avatars.com/api/?size=128&bold=true&uppercase=true&background=ffffff&color=000000&name=${encodeURIComponent(name)}`;
}

export async function createUser(
  userData: Partial<
    Pick<UserType, "firstName" | "lastName" | "email" | "password">
  >,
): Promise<void> {
  const id = uuidV4();

  const avatarURL = createAvatarURL(userData.firstName, userData.lastName);

  const refresh_token = generateRefreshToken({ id });
  const access_token = generateAccessToken({
    id,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    avatarURL,
  });

  const user = new User({
    user_id: id,
    access_token,
    refresh_token,

    email: userData.email,
    password: userData.password,
    role: "USER",

    firstName: userData.firstName,
    lastName: userData.lastName,
    avatarURL,
  });

  await user.save();
}
