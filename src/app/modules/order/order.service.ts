import mongoose from 'mongoose';
import { IJwtPayload } from '../auth/auth.interface';
import Meal from '../meal/meal.model';
import { generateTransactionId } from '../sslcommerz/payment.utils';
import { sslService } from '../sslcommerz/sslcommerz.service';
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

export const OrderServices = {
  createOrder,
};
