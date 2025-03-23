import { Schema, model } from 'mongoose';
import { IFlashSale } from './flashSale.interface';

const flashSaleSchema = new Schema<IFlashSale>(
  {
    meal: {
      type: Schema.Types.ObjectId,
      ref: 'Meal',
      required: [true, 'Meal ID is required'],
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: 0,
      max: 100,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'FoodCart',
      required: [true, 'FoodCart ID is required'],
    },
  },
  { timestamps: true }
);

export const FlashSale = model<IFlashSale>('FlashSale', flashSaleSchema);
