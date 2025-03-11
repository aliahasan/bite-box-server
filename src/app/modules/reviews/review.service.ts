import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { IJwtPayload } from '../auth/auth.interface';
import FoodCart from '../foodCart/foodCart.model';
import User from '../user/user.model';
import { IReview } from './review.interface';
import { Review } from './review.model';

const createReview = async (
  foodCartId: string,
  payload: IReview,
  authUser: IJwtPayload
) => {
  const user = await User.findById(authUser.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not found');
  }
  if (!user.isActive) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'you are blocked , you can not review'
    );
  }

  const foodCartIsExist = await FoodCart.findById(foodCartId);
  if (!foodCartIsExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Food cart not found');
  }
  console.log(payload);
  const review = new Review({
    review: payload.review,
    user: user._id,
    foodCart: foodCartId,
  });
  await review.save();
  return review;
};

export const reviewService = {
  createReview,
};
