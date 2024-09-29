import jwt from 'jsonwebtoken';

export const generateJWT = (payload: object, expiresIn: number) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn,
  });
};

export const verifyJWT = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as any;
};
