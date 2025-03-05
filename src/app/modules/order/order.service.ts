import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { IJwtPayload } from '../auth/auth.interface';
import FoodCart from '../foodCart/foodCart.model';
import Meal from '../meal/meal.model';
import { generateTransactionId } from '../sslcommerz/payment.utils';
import { sslService } from '../sslcommerz/sslcommerz.service';
import User from '../user/user.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (
  orderData: Partial<IOrder>,
  authUser: IJwtPayload
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (orderData.meals) {
      for (const mealItem of orderData.meals) {
        const meal = await Meal.findById(mealItem.meal)
          .populate('foodCart')
          .session(session);
        if (meal) {
          if (!meal.available) {
            throw new Error(` ${meal.name} is not available anymore`);
          }
          await meal.save({ session });
        } else {
          throw new Error(`Meal is not found in `);
        }
      }
    }
    const transactionId = generateTransactionId();
    const order = new Order({
      ...orderData,
      customer: authUser.userId,
      foodCart: orderData.foodCart,
      transactionId: transactionId,
    });
    console.log(order);
    const placedOrder = await order.save({ session });
    await placedOrder.populate('customer meals.meal');

    let result;

    if (placedOrder.paymentMethod == 'Online') {
      result = await sslService.initPayment({
        total_amount: placedOrder.finalAmount,
        tran_id: transactionId,
      });
      result = { paymentUrl: result };
    } else {
      result = order;
    }
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error) {
    console.log(error);
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getMyFoodCartOrders = async (
  query: Record<string, unknown>,
  authUser: IJwtPayload
) => {
  const user = await User.findById(authUser.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }
  if (!user.hasFoodCart) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User does not have any shop!');
  }
  const foodCart = await FoodCart.findOne({ owner: user._id });
  if (!foodCart) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Food cart not found!');
  }
  const foodCartOrdersQuery = new QueryBuilder(
    Order.find({ foodCart: foodCart._id })
      .populate({
        path: 'customer',
        select: 'name email dietaryPreferences photo',
      })
      .populate({
        path: 'meals.meal',
      }),
    query
  )
    .search(['meals.meal.name'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await foodCartOrdersQuery.modelQuery;
  const meta = await foodCartOrdersQuery.countTotal();
  return {
    meta,
    result,
  };
};

//get order details for meal provider
const getOrderDetails = async (orderId: string) => {
  const order = await Order.findById(orderId).populate('meals.meal');
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found!');
  }
  return order;
};

// get all orders for customers
const getMyOrders = async (
  query: Record<string, unknown>,
  authUser: IJwtPayload
) => {
  const orderQuery = new QueryBuilder(
    Order.find({ customer: authUser.userId }).populate('meals.meal'),
    query
  )
    .search(['meal.meal meal.meal.description'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();
  return {
    result,
    meta,
  };
};

export const OrderServices = {
  createOrder,
  getMyFoodCartOrders,
  getOrderDetails,
  getMyOrders,
};
