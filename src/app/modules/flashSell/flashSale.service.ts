import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { IJwtPayload } from '../auth/auth.interface';
import FoodCart from '../foodCart/foodCart.model';
import User from '../user/user.model';
import { ICreateFlashSale } from './flashSale.interface';
import { FlashSale } from './flashSale.model';

const createFlashSale = async (
  flashSellData: ICreateFlashSale,
  authUser: IJwtPayload
) => {
  const userHasFoodCart = await User.findById(authUser.userId).select(
    'isActive hasFoodCart'
  );

  if (!userHasFoodCart)
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  if (!userHasFoodCart.isActive)
    throw new AppError(StatusCodes.BAD_REQUEST, 'User account is not active!');
  if (!userHasFoodCart.hasFoodCart)
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'User does not have any Food cart!'
    );

  const foodCartIsActive = await FoodCart.findOne({
    owner: userHasFoodCart._id,
    isActive: true,
  }).select('isActive');

  if (!foodCartIsActive)
    throw new AppError(StatusCodes.BAD_REQUEST, 'Shop is not active!');

  const { meals, discountPercentage } = flashSellData;
  const createdBy = foodCartIsActive._id;

  const operations = meals.map((meal) => ({
    updateOne: {
      filter: { meal },
      update: {
        $setOnInsert: {
          meal,
          discountPercentage,
          createdBy,
        },
      },
      upsert: true,
    },
  }));

  const result = await FlashSale.bulkWrite(operations);
  return result;
};

// get all discount products
const getActiveFlashSalesService = async (query: Record<string, unknown>) => {
  const { minPrice, maxPrice, ...mQuery } = query;

  const flashSaleQuery = new QueryBuilder(
    FlashSale.find()
      .populate('meal')
      .populate('meal.category', 'name')
      .populate('meal.foodCart', 'foodCartName'),
    query
  ).paginate();

  const flashSales = await flashSaleQuery.modelQuery.lean();

  const flashSaleMap = flashSales.reduce((acc, flashSale) => {
    //@ts-ignore
    acc[flashSale.meal._id.toString()] = flashSale.discountPercentage;
    return acc;
  }, {});

  const mealsWithOfferPrice = flashSales.map((flashSale: any) => {
    const meal = flashSale.meal;
    //@ts-ignore
    const discountPercentage = flashSaleMap[meal._id.toString()];

    if (discountPercentage) {
      const discount = (discountPercentage / 100) * meal.price;
      meal.offerPrice = meal.price - discount;
    } else {
      meal.offerPrice = null;
    }
    return meal;
  });

  const meta = await flashSaleQuery.countTotal();

  return {
    meta,
    result: mealsWithOfferPrice,
  };
};

export const FlashSaleService = {
  createFlashSale,
  getActiveFlashSalesService,
};
