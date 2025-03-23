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
          const foodCart = await FoodCart.findById(meal.foodCart).session(
            session
          );
          if (!foodCart?.isActive) {
            throw new AppError(
              StatusCodes.BAD_REQUEST,
              'Food cart is not active right now'
            );
          }

          await meal.save({ session });
        } else {
          throw new Error(`Meal is not found in`);
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
    const placedOrder = await order.save({ session });
    await placedOrder.populate('customer meals.meal');

    let result;

    if (placedOrder.paymentMethod === 'Online') {
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
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

//get all orders of food cart
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
        path: 'meals.meal',
        select: 'name image',
      })
      .select(
        'totalAmount finalAmount orderStatus paymentStatus orderConfirmation createdAt meals.quantity meals.portionSize meals.unitPrice shippingAddress dietaryPreferences dietaryRestrictions schedule'
      ) as any,
    query
  )
    .search(['meals.meal.name'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await foodCartOrdersQuery.modelQuery.lean();
  const meta = await foodCartOrdersQuery.countTotal();
  const orderWithDetails = result.map((order) => ({
    ...order,
    //@ts-ignore
    meals: order?.meals?.map((meal) => ({
      _id: meal?.meal._id,
      name: meal?.meal.name,
      image: meal?.meal.image,
      quantity: meal?.quantity,
      portionSize: meal?.portionSize,
      unitPrice: meal?.unitPrice,
    })),
  }));
  return {
    result: orderWithDetails,
    meta,
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

// get all order of user/customers
const getMyOrders = async (
  query: Record<string, unknown>,
  authUser: IJwtPayload
) => {
  const orderQuery = new QueryBuilder(
    Order.find({ customer: authUser.userId })
      .populate({
        path: 'meals.meal',
        select: 'name image',
      })
      .select(
        'totalAmount finalAmount orderStatus paymentStatus orderConfirmation createdAt meals.quantity meals.portionSize meals.unitPrice'
      ) as any,
    query
  )
    .search(['meals.meal', 'meals.meal.description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const orders = await orderQuery.modelQuery.lean();
  const meta = await orderQuery.countTotal();
  const ordersWithMealsDetails = orders.map((order) => ({
    ...order,
    //@ts-ignore
    meals: order?.meals?.map((meal) => ({
      _id: meal.meal._id,
      name: meal.meal.name,
      image: meal.meal.image,
      quantity: meal.quantity,
      portionSize: meal.portionSize,
      unitPrice: meal.unitPrice,
    })),
  }));

  return {
    orders: ordersWithMealsDetails,
    meta,
  };
};

//update order status by meal provider
const updateOrderStatus = async (id: string, payload: { status: string }) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  if (order.orderStatus === 'Completed') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Order is completed, you cannot update it'
    );
  }
  if (order.orderStatus === 'Cancelled') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Order is already canceled, you cannot update it'
    );
  }

  const result = await Order.findOneAndUpdate(
    { _id: order._id },
    { orderStatus: payload.status },
    { new: true }
  );

  return result;
};

export const OrderServices = {
  createOrder,
  getMyFoodCartOrders,
  getOrderDetails,
  getMyOrders,
  updateOrderStatus,
};
