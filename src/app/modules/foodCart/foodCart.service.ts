import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { IImageFile } from '../../interface/IImageFile';
import { IJwtPayload } from '../auth/auth.interface';
import { Review } from '../reviews/review.model';
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

// get all food carts

const getAllFoodCarts = async (query: Record<string, unknown>) => {
  const foodCartsQuery = new QueryBuilder(FoodCart.find(), query)
    .search(['name', 'description', 'cuisines', 'address'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const foodCarts = await foodCartsQuery.modelQuery.lean();
  const meta = await foodCartsQuery.countTotal();
  const result = {
    foodCarts,
    meta,
  };
  return result;
};
const getSingleFoodCart = async (id: string) => {
  const foodCart = await FoodCart.findById(id);
  if (!foodCart) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Food Cart not found');
  }

  const foodCartsReview = await Review.find({
    foodCart: foodCart._id,
  }).populate({
    path: 'user',
    select: 'name photo', // Selecting only name and photo from the user
  });

  return { foodCart, reviews: foodCartsReview };
};

// food cart profile
const getMyFoodCart = async (authUser: IJwtPayload) => {
  const user = await User.findById(authUser.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  const result = await FoodCart.findOne({ owner: user._id }).populate({
    path: 'owner',
    select: 'name email photo phone',
  });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'You do not have any food cart');
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
  getAllFoodCarts,
  getSingleFoodCart,
  getMyFoodCart,
  updateFoodCart,
};
