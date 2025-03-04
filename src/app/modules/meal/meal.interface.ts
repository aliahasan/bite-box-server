import { Types } from 'mongoose';

export type TMeal = {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  available: boolean;
  foodCart: Types.ObjectId;
  averageRating?: number;
  ratingCount?: number;
  cuisine: string;
  ingredients: string[];
  portionSize: string[];
  dietaryPreferences?: string;
};
