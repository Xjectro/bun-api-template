import jwt from 'jsonwebtoken';
import { config } from '../../constants';

export const generateJwt = (payload: object, expiresIn: number) => {
  return jwt.sign(payload, config.secrets.jwt, {
    expiresIn,
  });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, config.secrets.jwt) as any;
};
