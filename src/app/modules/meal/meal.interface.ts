import { Types } from 'mongoose';

export interface TMeal extends Document {
  name: string;
  price: number;
  description: string;
  image: string;
  category: Types.ObjectId;
  offerPrice?: number | null;
  available: boolean;
  foodCart: Types.ObjectId;
  averageRating?: number;
  ratingCount?: number;
  cuisine: string;
  ingredients?: string[];
  portionSize: string[];
  dietaryPreferences?: string[];
  reviews?: Record<string, any> | [];

  calculateOfferPrice(): Promise<number | null>;
}
