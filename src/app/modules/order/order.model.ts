import { StatusCodes } from 'http-status-codes';
import mongoose, { Schema } from 'mongoose';
import AppError from '../../errors/appError';
import Meal from '../meal/meal.model';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    foodCart: {
      type: Schema.Types.ObjectId,
      ref: 'FoodCart',
      required: true,
    },
    meals: [
      {
        meal: {
          type: Schema.Types.ObjectId,
          ref: 'Meal',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        portionSize: {
          type: String,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 30,
    },
    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    dietaryPreferences: {
      type: [String],
    },
    dietaryRestrictions: {
      type: [String],
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Online'],
      default: 'Online',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate total, delivery charge, and final price
orderSchema.pre('validate', async function (next) {
  const order = this;

  // Step 1: Initialize total amount
  let totalAmount = 0;
  let foodCartId: Schema.Types.ObjectId | null = null;

  // Step 2: Calculate total amount for products
  for (let item of order.meals) {
    const meal = await Meal.findById(item.meal).populate('foodCart');
    if (!meal) {
      return next(new AppError(StatusCodes.NOT_FOUND, `Meal not found`));
    }

    if (foodCartId && String(foodCartId) !== String(meal.foodCart._id)) {
      return next(
        new AppError(
          StatusCodes.BAD_REQUEST,
          'All meals should belong to the same food cart'
        )
      );
    }

    //@ts-ignore
    foodCartId = meal.foodCart._id;

    let mealPrice = meal.price;

    if (item.portionSize === 'medium') {
      mealPrice += 10; // Add 10 if portion size is medium
    } else if (item.portionSize === 'large') {
      mealPrice += 20; // Add 20 if portion size is large
    }

    item.unitPrice = mealPrice;
    totalAmount += mealPrice * item.quantity;
  }

  // Step 3: Set final total amount including delivery charge
  order.totalAmount = totalAmount;
  order.finalAmount = totalAmount + (order.deliveryCharge || 30); // Default delivery charge is 30
  next();
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);
