import mongoose, { Schema } from 'mongoose';
import { FlashSale } from '../flashSell/flashSale.model';
import { TMeal } from './meal.interface';

const mealSchema = new Schema<TMeal>(
  {
    foodCart: {
      type: Schema.Types.ObjectId,
      ref: 'FoodCart',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    available: {
      type: Boolean,
      required: true,
      default: true,
    },
    dietaryPreferences: {
      type: [String],
      default: [],
    },
    cuisine: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    portionSize: {
      type: [String],
      required: true,
      enum: ['small', 'medium', 'large'],
      default: ['small'],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

mealSchema.methods.calculateOfferPrice = async function () {
  const flashSale = await FlashSale.findOne({ meal: this._id });
  if (flashSale) {
    const discount = (flashSale.discountPercentage / 100) * this.price;
    return this.price - discount;
  }
  return null; // or can be return 0 or another default value
};

const Meal = mongoose.model<TMeal>('Meal', mealSchema);
export default Meal;
