import mongoose, { Schema } from 'mongoose';
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
      type: String,
      required: true,
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

const Meal = mongoose.model<TMeal>('Meal', mealSchema);
export default Meal;
