import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../errors/appError';
import { IImageFile } from '../../interface/IImageFile';
import { IJwtPayload } from '../auth/auth.interface';
import User from '../user/user.model';
import { IFoodCart } from './foodCart.interface';
import FoodCart from './foodCart.model';

const createFoodCart = async (
  foodCartData: Partial<IFoodCart>,
  image: IImageFile,
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

    if (image) {
      foodCartData.image = image.path;
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

    await session.commitTransaction();
    session.endSession();

    return createFoodCart;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getMyFoodCart = async (authUser: IJwtPayload) => {
  const result = await FoodCart.findOne({ owner: authUser.userId });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Food cart not found');
  }
  return result;
};

const updateFoodCart = async (
  id: string,
  payload: Partial<IFoodCart>,
  image: IImageFile,
  authUser: IJwtPayload
) => {
  // Check if the food cart exists
  const foodCart = await FoodCart.findById(id);
  if (!foodCart) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Food cart not found');
  }
  const isOwner = await FoodCart.findOne({ owner: authUser.userId });

  if (!isOwner) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'User is not authorized to update this food cart'
    );
  }

  if (image) {
    payload.image = image.path;
  }
  const result = await FoodCart.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const foodCartServices = {
  createFoodCart,
  getMyFoodCart,
  updateFoodCart,
};
