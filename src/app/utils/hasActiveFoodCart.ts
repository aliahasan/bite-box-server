import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/appError';
import User from '../modules/user/user.model';

export const hasActiveFoodCart = async (userId: string) => {
  const isUserExist = await User.checkUserExist(userId);
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (!isUserExist.hasFoodCart) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You don't have any food cart!"
    );
  }
};
