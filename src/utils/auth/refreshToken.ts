import jwt from "jsonwebtoken";
import { config } from "../../constants";

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.secrets.jwt) as any;
};
