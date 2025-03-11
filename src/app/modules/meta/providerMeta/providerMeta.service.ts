import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/appError';
import { IJwtPayload } from '../../auth/auth.interface';
import FoodCart from '../../foodCart/foodCart.model';
import Meal from '../../meal/meal.model';
import { Order } from '../../order/order.model';
import User from '../../user/user.model';

const getProviderMetaData = async (
  query: Record<string, unknown>,
  authUser: IJwtPayload
) => {
  // Find the authenticated user
  const user = await User.findById(authUser.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // Check if the user owns a food cart
  const userFoodCart = await FoodCart.findOne({ owner: user._id });
  if (!userFoodCart) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User does not have any shop');
  }

  // Aggregate order data for this food cart
  const orderStats = await Order.aggregate([
    {
      $match: { foodCart: userFoodCart._id },
    },
    {
      $group: {
        _id: '$orderStatus',
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$finalAmount' },
      },
    },
  ]);

  // Format data for easy use
  const formattedData = {
    totalOrders: orderStats.reduce((acc, curr) => acc + curr.totalOrders, 0),
    totalRevenue: orderStats.reduce((acc, curr) => acc + curr.totalRevenue, 0),
    orderBreakdown: orderStats.map((status) => ({
      status: status._id,
      total: status.totalOrders,
    })),
  };

  // Get total meal items for the food cart
  const totalMealItems = await Meal.aggregate([
    { $match: { foodCart: userFoodCart._id } },
    {
      $group: {
        _id: null,
        totalMeals: { $sum: 1 },
      },
    },
  ]);

  const totalMealsCount =
    totalMealItems.length > 0 ? totalMealItems[0].totalMeals : 0;

  return {
    ...formattedData,
    totalMealItems: totalMealsCount,
  };
};

export const ProviderMetaService = {
  getProviderMetaData,
};
