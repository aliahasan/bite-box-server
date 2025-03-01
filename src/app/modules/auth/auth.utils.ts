import jwt, { SignOptions } from 'jsonwebtoken';
import { IJwtPayload } from './auth.interface';
export const generateToken = (
  jwtPayload: IJwtPayload,
  secret: string,
  expiresIn: string | number
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn: expiresIn } as SignOptions);
};
