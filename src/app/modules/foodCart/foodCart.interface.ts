import { Schema } from 'mongoose';

export interface IFoodCart extends Document {
  foodCartName: string;
  address: string;
  contactNumber: string;
  owner: Schema.Types.ObjectId;
  description: string;
  cuisines: string[];
  experience: number;
  availability: {
    days: string;
    hours: string;
  };
  ratings?: number;
  image?: string;
  isActive: boolean;
}
