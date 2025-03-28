import mongoose, { Model, Schema } from 'mongoose';
import { IFoodCart } from './foodCart.interface';

const foodCartSchema = new Schema<IFoodCart>(
  {
    foodCartName: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cuisines: {
      type: [String],
      required: true,
    },
    availability: {
      days: String,
      hours: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const FoodCart: Model<IFoodCart> = mongoose.model<IFoodCart>(
  'FoodCart',
  foodCartSchema
);
export default FoodCart;
