import { Model } from 'mongoose';

export enum UserRole {
  CUSTOMER = 'customer',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  hasFoodCart: boolean;
  dietaryPreferences?: string[];
  preferredCuisines?: string[];
  deliveryAddress?: string;
  isActive: boolean;
  photo?: string;
}

export interface UserModel extends Model<IUser> {
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isUserExistsByEmail(id: string): Promise<IUser>;
  checkUserExist(userId: string): Promise<IUser>;
}
