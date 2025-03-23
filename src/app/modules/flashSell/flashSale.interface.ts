import { Types } from 'mongoose';

export interface IFlashSale {
  meal: Types.ObjectId;
  discountPercentage: number;
  createdBy?: Types.ObjectId;
}

export interface ICreateFlashSale {
  meals: string[];
  discountPercentage: number;
}
