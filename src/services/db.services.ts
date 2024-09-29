import mongoose from 'mongoose';
import { User, UserType } from '../database/models/user.model';
import { UserAuth, UserAuthType } from '../database/models/userAuth.model';
import { createAvatarURL } from '../utils/helpers';
import { v4 as uuidV4 } from 'uuid';
import { Connection } from '../database/models/connection.model';
import { Transaction } from '../database/models/transaction.model';
import { UnauthorizedError } from '../api/commons/exceptions';
import { generateCode } from '../utils/auth/crypto';
import { generateJwt } from '../utils/auth/jwt';

export async function createUser(
  userData: Partial<Pick<UserType, 'firstName' | 'lastName' | 'username'> & Pick<UserAuthType, 'email' | 'password'>>,
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

  const refresh_token = generateJwt({ id: user._id }, 315360000);

  await user.save();

  const userAuth = new UserAuth({
    user: user._id,
    email: userData.email,
    password: userData.password,
    refresh_token,
    role: 'USER',
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

  return await Connection.updateOne({ user, type }, { $set: updateData }, { upsert: true });
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

export async function checkTransaction({ code, action }: { code: string; action: string }) {
  const transaction = await Transaction.findOne({ code }).populate('user');

  if (!transaction?.user) {
    throw new UnauthorizedError('Code is incorrect!');
  }

  const currentTime = new Date();
  if (transaction.action !== action || transaction.expiresAt <= currentTime) {
    throw new UnauthorizedError('Code is expired or action does not match!');
  }

  return transaction;
}

export async function createTransaction({
  user,
  action,
  ref,
  format,
}: {
  user: string;
  action: string;
  ref?: string;
  format?: 'jwt';
}) {
  let code = '';
  const expiresAt = new Date(Date.now() + 180 * 1000);

  if (format == 'jwt') {
    code = generateJwt({ user, action, ref }, 180);
  } else {
    code = generateCode({ length: 5 });
  }

  ref = ref?.replace('[code]', code);

  await Transaction.create({
    user,
    action,
    code,
    ref,
    expiresAt,
  });

  return { code, ref, user, action };
}
