import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import mongoose, { Schema } from 'mongoose';
import config from '../../config';
import AppError from '../../errors/appError';
import { IUser, UserModel, UserRole } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER],
      default: UserRole.CUSTOMER,
    },
    hasFoodCart: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: null,
    },
    photo: {
      type: String,
      default: null,
    },

    dietaryPreferences: [String],
    preferredCuisines: [String],
    deliveryAddress: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.checkUserExist = async function (userId: string) {
  const existingUser = await this.findById(userId);

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'User does not exist!');
  }

  if (!existingUser.isActive) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'User is not active!');
  }

  return existingUser;
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);
export default User;
