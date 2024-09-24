import {
  UnauthorizedError,
  DuplicatedDataError,
} from "../../api/commons/exceptions";
import { User } from "../../database/models/user.model";
import { UserAuth } from "../../database/models/userAuth.model";

export default class AuthHelpers {
  checkUserExists = async (username: string, email: string) => {
    const user = await User.findOne({ username }).exec();
    if (user) {
      throw new DuplicatedDataError("User already exists!");
    }

    const userAuth = await UserAuth.findOne({ email }).exec();
    if (userAuth) {
      throw new DuplicatedDataError("User already exists!");
    }
  };

  validateCredentials = async (email: string, password: string) => {
    const userAuth = await UserAuth.findOne({ email }).exec();
    if (!userAuth || !(await userAuth.comparePassword(password))) {
      throw new UnauthorizedError("Email or password is incorrect!");
    }
  };

  getUserAuth = async (email: string) => {
    const userAuth = await UserAuth.findOne({ email }).exec();
    if (!userAuth) {
      throw new UnauthorizedError("Email is incorrect!");
    }
    return userAuth;
  };

  getUser = async (email: string) => {
    const userAuth = await UserAuth.findOne({ email }).exec();
    const user = await User.findById(userAuth?.user).exec();
    if (!user) {
      throw new UnauthorizedError("User not found!");
    }
    return user;
  };
}
