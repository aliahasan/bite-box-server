import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/appError';
import { IJwtPayload } from '../../auth/auth.interface';
import { Order } from '../../order/order.model';
import User from '../../user/user.model';

const getCustomerMetaService = async (
  query: Record<string, unknown>,
  authUser: IJwtPayload
) => {
  const user = await User.findById(authUser.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  const orderStats = await Order.aggregate([
    {
      $match: { customer: user._id },
    },
    {
      $group: {
        _id: '$orderStatus',
        totalOrders: { $sum: 1 },
        totalCost: { $sum: '$finalAmount' },
      },
    },
  ]);
  const formattedData = {
    totalOrders: orderStats.reduce((acc, curr) => acc + curr.totalOrders, 0),
    totalCost: orderStats.reduce((acc, curr) => acc + curr.totalCost, 0),
    orderBreakdown: orderStats.map((status) => ({
      status: status?._id,
      total: status?.totalOrders,
    })),
  };
  return formattedData;
};

export const customerMetaService = {
  getCustomerMetaService,
};
