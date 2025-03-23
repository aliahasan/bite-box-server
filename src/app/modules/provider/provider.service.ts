import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { IJwtPayload } from '../auth/auth.interface';
import FoodCart from '../foodCart/foodCart.model';
import { TMeal } from '../meal/meal.interface';
import Meal from '../meal/meal.model';
import User from '../user/user.model';

// get all meals of food carts provider
const getMyFoodCartsMeal = async (
  authUser: IJwtPayload,
  query: Record<string, unknown>
) => {
  const user = await User.findById(authUser.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (!user.hasFoodCart) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User does not have a food cart');
  }

  const foodCart = await FoodCart.findOne({ owner: user._id }).select('_id');
  if (!foodCart) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Food cart not found');
  }

  const { minPrice, maxPrice, ...pQuery } = query;
  const mealQuery = new QueryBuilder(
    Meal.find({ foodCart: foodCart._id }),
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

  const mealWithOfferPrice = await Promise.all(
    meals.map(async (meal) => {
      const allMeals = await Meal.findById(meal._id);
      const offerPrice = await allMeals?.calculateOfferPrice();
      return {
        ...meal,
        offerPrice: Number(offerPrice) || null,
      };
    })
  );
  const meta = await mealQuery.countTotal();
  return {
    meals: mealWithOfferPrice,
    meta,
  };
};

// update  meal stock by provider
const updateMealStock = async (
  id: string,
  authUser: IJwtPayload,
  payload: Partial<TMeal>
) => {
  const meal = await Meal.findById(id);
  if (!meal) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Meal not found');
  }
  const updateStock = Meal.findOneAndUpdate(meal._id, payload, {
    new: true,
  });
  return updateStock;
};

export const providerServices = {
  getMyFoodCartsMeal,
  updateMealStock,
};
