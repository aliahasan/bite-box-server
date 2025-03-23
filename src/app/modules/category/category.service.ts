import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { IImageFile } from '../../interface/IImageFile';
import { IJwtPayload } from '../auth/auth.interface';
import FoodCart from '../foodCart/foodCart.model';
import User from '../user/user.model';
import { ICategory } from './category.interface';
import { Category } from './category.model';

const createCategory = async (
  payload: Partial<ICategory>,
  image: IImageFile,
  authUser: IJwtPayload
) => {
  const user = await User.findById(authUser.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const foodCart = await FoodCart.findOne({ owner: user._id }).select('_id');
  if (!foodCart) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'User does not have any foodCart'
    );
  }
  const isCategoryExist = await Category.findOne({ name: payload.name });
  if (isCategoryExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Category already exists');
  }

  const category = new Category({
    ...payload,
    createdBy: foodCart,
    image: image?.path,
  });

  const result = await category.save();
  return result;
};

const getAllCategory = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(Category.find(), query)
    .search(['name', 'slug'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const categories = await categoryQuery.modelQuery;
  const meta = await categoryQuery.countTotal();
  return {
    result: categories,
    meta,
  };
};

export const CategoryService = {
  createCategory,
  getAllCategory,
};
