import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { IImageFile } from '../../interface/IImageFile';
import { IJwtPayload } from '../auth/auth.interface';
import { FlashSale } from '../flashSell/flashSale.model';
import FoodCart from '../foodCart/foodCart.model';
import { Order } from '../order/order.model';
import User from '../user/user.model';
import { TMeal } from './meal.interface';
import Meal from './meal.model';

// get all the meal with offerPrice
const getAllMeal = async (query: Record<string, unknown>) => {
  const { minPrice, maxPrice, ...pQuery } = query;
  const mealQuery = new QueryBuilder(
    Meal.find()
      .populate({
        path: 'foodCart',
        select: '-owner',
      })
      .populate({
        path: 'category',
        select: 'name',
      }),
    pQuery
  )
    .search(['name', 'description', 'cuisine', 'dietaryPreferences'])
    .filter()
    .sort()
    .paginate()
    .ratings()
    .fields()
    .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);

  const meals = await mealQuery.modelQuery.lean();

  const meta = await mealQuery.countTotal();

  //get flash sale discounts
  const mealIds = meals.map((meal: any) => meal._id);

  const flashSales = await FlashSale.find({
    meal: { $in: mealIds },
    discountPercentage: { $gt: 0 },
  }).select('meal discountPercentage');

  const flashSaleMap = flashSales.reduce(
    (acc, { meal, discountPercentage }) => {
      // @ts-ignore
      acc[meal.toString()] = discountPercentage;
      return acc;
    },
    {}
  );
  // Add offer price to meals
  const updatedMeals = meals.map((meal: any) => {
    //@ts-ignore
    const discountPercentage = flashSaleMap[meal._id.toString()];
    if (discountPercentage) {
      meal.offerPrice = meal.price * (1 - discountPercentage / 100);
    } else {
      meal.offerPrice = null;
    }
    return meal;
  });

  const result = {
    meals: updatedMeals,
    meta,
  };
  return result;
};

// create-meal-by provider
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

// get single meal with related products
const getSingleMeal = async (id: string) => {
  const meal = await Meal.findById(id)
    .populate({
      path: 'foodCart',
      select: '-owner',
    })
    .populate('category');
  if (!meal) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Meal not found');
  }

  const offerPrice = await meal.calculateOfferPrice();
  const mealObj = meal.toObject();

  // Find related meals (same category, excluding current meal)
  const relatedMeals = await Meal.find({
    category: meal.category,
    _id: { $ne: meal._id },
  })
    .limit(4)
    .populate({
      path: 'foodCart',
      select: '-owner',
    })
    .populate('category')
    .exec();
  return {
    ...mealObj,
    offerPrice,
    relatedMeals,
  };
};

// update-meal-by provider
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
  if (!hasFoodCart) {
    throw new AppError(StatusCodes.BAD_REQUEST, "You don't have a food cart");
  }

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

// delete meal by provider
const deleteMeal = async (id: string, authUser: IJwtPayload) => {
  const user = await User.findById(authUser.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const hasFoodCart = await FoodCart.findOne({ owner: user._id });
  if (!hasFoodCart) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Food cart not found');
  }

  const meal = await Meal.findOne({
    _id: id,
    foodCart: hasFoodCart._id,
  });

  if (!meal) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Meal not found');
  }

  //Check if the meal is already included in any order
  const isMealExistInOrder = await Order.findOne({ 'meals.meal': meal._id });

  if (isMealExistInOrder) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Cannot delete meal because it is included in an existing order'
    );
  }

  //  Delete the meal if it is not part of any order
  const deletedMeal = await Meal.findByIdAndDelete(meal._id);
  return deletedMeal;
};

// get all meal categories
const getAllCategories = async () => {
  try {
    const categories = await Meal.distinct('category');
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to get categories');
  }
};

// get all cuisines of food
const getAllCuisines = async () => {
  try {
    const cuisines = await Meal.distinct('cuisine');
    return cuisines;
  } catch (error) {
    console.error('Error fetching cuisines:', error);
    throw new Error('Failed to get cuisines');
  }
};

export const mealServices = {
  createMal,
  updateMeal,
  deleteMeal,
  getAllMeal,
  getSingleMeal,
  getAllCategories,
  getAllCuisines,
};
