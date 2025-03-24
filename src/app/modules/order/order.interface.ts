import { Document, Types } from 'mongoose';

export interface IOrderMeal {
  meal: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  portionSize?: 'small' | 'medium' | 'large';
}

export interface IOrder extends Document {
  customer: Types.ObjectId;
  foodCart: Types.ObjectId;
  meals: IOrderMeal[];
  totalAmount: number;
  discount?: number;
  deliveryCharge: number;
  finalAmount: number;
  orderStatus: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  shippingAddress: string;
  paymentMethod: 'Cash' | 'Card' | 'Online';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  dietaryPreferences?: string[];
  dietaryRestrictions?: string[];
  schedule?: Date;
  transactionId?: string;
  orderConfirmation: 'Pending' | 'Accept' | 'Decline';
}
