import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { IImageFile } from '../../interface/IImageFile';
import { IJwtPayload } from '../auth/auth.interface';
import { IUser, UserRole } from './user.interface';
import User from './user.model';

// register a user
const registerUser = async (payload: Record<string, unknown>) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email is already registered');
  }
  const userPayload = {
    ...payload,
    role: payload?.role ?? UserRole.CUSTOMER,
  };
  const user = await User.create(userPayload);
  return user;
};

// get user profile
const myProfile = async (authUser: IJwtPayload) => {
  const isUserExists = await User.findById(authUser.userId).select('-password');
  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  return isUserExists;
};

// update profile
const updateProfile = async (
  payload: Partial<IUser>,
  file: IImageFile,
  authUser: IJwtPayload
) => {
  const isUserExists = await User.findById(authUser.userId);
  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }
  if (!isUserExists.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is not active!');
  }
  if (file && file.path) {
    payload.photo = file.path;
  }
  const result = await User.findOneAndUpdate(
    { user: authUser.userId },
    payload,
    {
      new: true,
    }
  );
  return result;
};

//update use prafarances

const updatePreferences = async (
  authUser: IJwtPayload,
  payload: Partial<IUser>
) => {
  const user = await User.findById(authUser.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not found');
  }
  if (!user.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is not active!');
  }

  const updatedFields: Partial<IUser> = {};

  if (payload.dietaryPreferences) {
    user.dietaryPreferences = payload.dietaryPreferences;
    updatedFields.dietaryPreferences = payload.dietaryPreferences;
  }
  if (payload.preferredCuisines) {
    user.preferredCuisines = payload.preferredCuisines;
    updatedFields.preferredCuisines = payload.preferredCuisines;
  }
  if (payload.dietaryRestrictions) {
    user.dietaryRestrictions = payload.dietaryRestrictions;
    updatedFields.dietaryRestrictions = payload.dietaryRestrictions;
  }
  if (payload.portion) {
    user.portion = payload.portion;
    updatedFields.portion = payload.portion;
  }
  await user.save();
  return updatedFields;
};

//admin can only update user status
const updateUserStatus = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not found');
  }
  user.isActive = !user.isActive;
  const updatedUser = await user.save();
  return updatedUser;
};

export const userServices = {
  registerUser,
  myProfile,
  updateProfile,
  updateUserStatus,
  updatePreferences,
};
