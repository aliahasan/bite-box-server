import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import tryCatchAsync from '../../utils/tryCatchAsync';
import { IJwtPayload } from '../auth/auth.interface';
import { providerServices } from './provider.service';

const handleGetMyFoodCartMeals = tryCatchAsync(async (req, res) => {
  const user = req.user as IJwtPayload;
  const result = await providerServices.getMyFoodCartsMeal(user, req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meals are retrieved successfully',
    meta: result.meta,
    data: result.meals,
  });
});

const handleUpdateMealStock = tryCatchAsync(async (req, res) => {
  const user = req.user as IJwtPayload;
  const mealId = req.params.mealId;
  const result = await providerServices.updateMealStock(mealId, user, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Stock updated successfully',
    data: result,
  });
});

export const providerControllers = {
  handleGetMyFoodCartMeals,
  handleUpdateMealStock,
};
