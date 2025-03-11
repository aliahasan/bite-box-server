import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/appError';
import { IJwtPayload } from '../../auth/auth.interface';
import FoodCart from '../../foodCart/foodCart.model';
import Meal from '../../meal/meal.model';
import { Order } from '../../order/order.model';

const getProviderMetaData = async (
  query: Record<string, unknown>,
  authUser: IJwtPayload
) => {
  // Check if the user owns a food cart
  const userFoodCart = await FoodCart.findOne({ owner: authUser.userId });
  if (!userFoodCart) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User does not have any shop');
  }

  // Execute all queries in parallel
  const [orderStats, paymentStats, totalMealItems] = await Promise.all([
    // Fetch order statistics based on orderStatus

    Order.aggregate([
      { $match: { foodCart: userFoodCart._id } },
      {
        $group: {
          _id: '$orderStatus',
          totalOrders: { $sum: 1 },
        },
      },
    ]),

    // Fetch revenue from paid orders
    Order.aggregate([
      { $match: { foodCart: userFoodCart._id, paymentStatus: 'Paid' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$finalAmount' },
        },
      },
    ]),
    //calculate the total meal item
    Meal.countDocuments({ foodCart: userFoodCart._id }),
  ]);

  // Process order statistics and format as array
  const totalOrders = orderStats.reduce(
    (acc, curr) => acc + (curr.totalOrders || 0),
    0
  );

  const orderBreakdown = [
    {
      status: 'Pending',
      total: orderStats.find((s) => s._id === 'Pending')?.totalOrders || 0,
    },
    {
      status: 'Cancelled',
      total: orderStats.find((s) => s._id === 'Cancelled')?.totalOrders || 0,
    },
    {
      status: 'Completed',
      total: orderStats.find((s) => s._id === 'Completed')?.totalOrders || 0,
    },
  ];

  // Get total revenue from paid orders
  const totalRevenue =
    paymentStats.length > 0 ? paymentStats[0].totalRevenue : 0;

  return {
    totalOrders,
    totalRevenue,
    totalMealItems,
    orderBreakdown,
  };
};

export const ProviderMetaService = {
  getProviderMetaData,
};
