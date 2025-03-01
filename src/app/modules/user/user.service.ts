import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { IUser } from './user.interface';
import User from './user.model';

const registerUser = async (payload: Partial<IUser>) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email is already registered');
  }
  const user = User.create(payload);
  return user;
};

export const userServices = {
  registerUser,
};
