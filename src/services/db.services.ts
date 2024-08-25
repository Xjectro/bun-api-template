import { User, UserType } from "../database/models/user.model";
import { UserAuth, UserAuthType } from "../database/models/userAuth.model";
import { generateRefreshToken } from "../utils/auth/refreshToken";
import { createAvatarURL } from "../utils/helpers";
import { v4 as uuidV4 } from "uuid";

export async function createUser(
  userData: Partial<
    Pick<UserType, "firstName" | "lastName" | "username"> &
    Pick<UserAuthType, "email" | "password">
  >,
): Promise<void> {
  const id = uuidV4();
  const avatarURL = createAvatarURL(userData.firstName, userData.lastName);
  const refresh_token = generateRefreshToken({ id });

  const user = new User({
    user_id: id,
    username: userData.username,
    firstName: userData.firstName,
    lastName: userData.lastName,
    avatarURL,
  });

  await user.save();

  const userAuth = new UserAuth({
    user: user._id,
    email: userData.email,
    password: userData.password,
    refresh_token,
    role: "USER",
  });

  await userAuth.save();
}
