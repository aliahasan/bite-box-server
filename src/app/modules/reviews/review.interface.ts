import { Schema } from 'mongoose';

export interface IReview {
  review: string;
  user: Schema.Types.ObjectId;
  foodCart: Schema.Types.ObjectId;
  isFlagged?: boolean;
  flaggedReason?: string;
  isVerifiedPurchase?: boolean;
}
