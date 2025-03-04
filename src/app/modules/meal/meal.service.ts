import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { IImageFile } from '../../interface/IImageFile';
import { IJwtPayload } from '../auth/auth.interface';
import FoodCart from '../foodCart/foodCart.model';
import User from '../user/user.model';
import { TMeal } from './meal.interface';
import Meal from './meal.model';

const getAllMeal = async (query: Record<string, unknown>) => {
  const { minPrice, maxPrice } = query;
  const mealQuery = new QueryBuilder(
    Meal.find().populate({
      path: 'foodCart',
      select: '-owner',
    }),
    query
  )
    .search(['name', 'description', 'cuisine', 'dietaryPreferences'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);

  const meals = await mealQuery.modelQuery.lean();
  const meta = await mealQuery.countTotal();
  const result = {
    meals,
    meta,
  };
  return result;
};

const getSingleMeal = async (id: string) => {
  const meal = await Meal.findById(id).populate({
    path: 'foodCart',
    select: '-owner',
  });
  if (!meal) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Meal not found');
  }
  return meal;
};

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
) => {
  const user = await User.findById(authUser.userId);
  const hasFoodCart = await FoodCart.findOne({ owner: user?._id });
  const meal = await Meal.findOne({
    _id: id,
    foodCart: hasFoodCart?._id,
  });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (!meal) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Meal not found');
  }
  if (image) {
    payload.image = image.path;
  }
  const updatedMeal = await Meal.findByIdAndUpdate(meal._id, payload, {
    new: true,
    runValidators: true,
  });
  return updatedMeal;
};

const deleteMeal = async (id: string, authUser: IJwtPayload) => {
  const user = await User.findById(authUser.userId);
  const hasFoodCart = await FoodCart.findOne({ owner: user?._id });
  const meal = await Meal.findOne({
    _id: id,
    foodCart: hasFoodCart?._id,
  });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (!meal) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Meal not found');
  }
  const deleteMeal = await Meal.findByIdAndDelete(meal._id);
  return deleteMeal;
};

export const mealServices = {
  createMal,
  updateMeal,
  deleteMeal,
  getAllMeal,
  getSingleMeal,
};
