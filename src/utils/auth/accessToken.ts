import jwt from "jsonwebtoken";
import { config } from "../../constants";

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, config.secrets.jwt, {
    expiresIn: "30d",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.secrets.jwt) as any;
};
