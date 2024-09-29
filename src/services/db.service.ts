import { v4 as uuidV4 } from 'uuid';
import { generateJWT } from '../utils/modules/jwt';
import { createAvatarURL } from '../utils/helpers';
import { User, type UserType } from '../database/models/user.model';
import { Auth, type AuthType } from '../database/models/auth.model';

export const updateStates = (params: Record<string, unknown>) => {
  return Object.entries(params).reduce(
    (obj, [key, value]) => {
      obj[key] = value;
      return obj;
    },
    {} as Record<string, unknown>,
  );
};

export async function createUser(
  data: Partial<
    Pick<UserType, "firstName" | "lastName" | "username"> &
    Pick<AuthType, "email" | "password">
  >,
) {
  const id = uuidV4();
  const avatarURL = createAvatarURL([
    data.firstName,
    data.lastName,
  ] as string[]);

  const user = new User({
    user_id: id,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    avatarURL,
  });

  const refresh_token = generateJWT({ id: user._id }, 315360000);

  await user.save();

  const auth = new Auth({
    user: user._id,
    email: data.email,
    password: data.password,
    refresh_token,
  });

  await auth.save();

  user.auth = auth._id;

  await user.save();

  return user._id;
}

