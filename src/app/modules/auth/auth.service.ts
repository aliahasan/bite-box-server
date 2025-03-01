import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import AppError from '../../errors/appError';
import User from '../user/user.model';
import { IAuth, IJwtPayload } from './auth.interface';
import { generateToken } from './auth.utils';

const loginUser = async (payload: IAuth) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (!user.isActive) {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is not active');
  }

  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Password does not match');
  }

  const jwtPayload: IJwtPayload = {
    name: user.name,
    userId: user._id,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    hasMealProvider: user.hasFoodCart,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return { accessToken, refreshToken };
};

export const authServices = {
  loginUser,
};
