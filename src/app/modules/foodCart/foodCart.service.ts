import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../errors/appError';
import { IJwtPayload } from '../auth/auth.interface';
import User from '../user/user.model';
import { IFoodCart } from './foodCart.interface';
import FoodCart from './foodCart.model';

const createFoodCart = async (
  foodCartData: Partial<IFoodCart>,
  authUser: IJwtPayload
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(authUser.userId).session(session);
    if (!user) {
      throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'User is not exist');
    }
    if (!user.isActive) {
      throw new AppError(StatusCodes.FORBIDDEN, 'User is not active');
    }

    if (user.hasFoodCart) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'User already has a food cart'
      );
    }

    const foodCart = new FoodCart({
      ...foodCartData,
      owner: user._id,
    });

    const createFoodCart = await foodCart.save({ session });

    await User.findByIdAndUpdate(
      user._id,
      { hasFoodCart: true },
      { new: true, session }
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const foodCartServices = {
  createFoodCart,
};
