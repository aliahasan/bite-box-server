import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { IImageFile } from '../../interface/IImageFile';
import { IJwtPayload } from '../auth/auth.interface';
import FoodCart from '../foodCart/foodCart.model';
import User from '../user/user.model';
import { TMeal } from './meal.interface';
import Meal from './meal.model';

const createMal = async (
  payload: Partial<TMeal>,
  image: IImageFile,
  authUser: IJwtPayload
) => {
  const user = await User.findById(authUser.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (!user.hasFoodCart) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User does not have a food cart');
  }
  const hasFoodCart = await FoodCart.findOne({ owner: authUser.userId });
  if (!hasFoodCart) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'you do not have any food cart'
    );
  }

  if (!hasFoodCart.isActive) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Food cart is not active');
  }

  if (image) {
    payload.image = image.path;
  }
  const newMeal = new Meal({
    ...payload,
    foodCart: hasFoodCart._id,
  });
  const result = await newMeal.save();
  return result;
};

const updateMeal = async (
  id: string,
  payload: Partial<TMeal>,
  image: IImageFile,
  authUser: IJwtPayload
) => {};

export const mealServices = {
  createMal,
  updateMeal,
};
