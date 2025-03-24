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
          default: 'small',
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
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
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    schedule: {
      type: Date,
    },
    orderConfirmation: {
      type: String,
      enum: ['Pending', 'Accept', 'Decline'],
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
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate total, discount, delivery charge, and final price
orderSchema.pre('validate', async function (next) {
  const order = this;

  // Step 1: Initialize total amount
  let totalAmount = 0;
  let finalDiscount = 0;
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

    const offerPrice = (await meal.calculateOfferPrice()) || 0;

    let mealPrice = meal.price;
    if (offerPrice) {
      mealPrice = Number(offerPrice);
    }

    if (item.portionSize === 'medium') {
      mealPrice += 20; // Add 20 if portion size is medium
    } else if (item.portionSize === 'large') {
      mealPrice += 40; // Add 20 if portion size is large
    }

    item.unitPrice = mealPrice;
    const price = mealPrice * item.quantity;
    console.log(price);
    totalAmount += price;
  }

  const isDhaka = order?.shippingAddress?.toLowerCase()?.includes('dhaka');
  const deliveryCharge = isDhaka ? 60 : 100;

  // Step 3: Set final total amount including discount and delivery charge
  order.totalAmount = totalAmount;
  order.discount = finalDiscount;
  order.deliveryCharge = deliveryCharge;
  order.finalAmount = totalAmount - finalDiscount + deliveryCharge;
  next();
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);
