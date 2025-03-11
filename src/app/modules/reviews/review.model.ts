import { model, Schema } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>(
  {
    review: {
      type: String,
      required: [true, 'Review text is required.'],
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    foodCart: {
      type: Schema.Types.ObjectId,
      ref: 'FoodCart',
      required: true,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    flaggedReason: {
      type: String,
      default: '',
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export const Review = model<IReview>('Review', reviewSchema);
