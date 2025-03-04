import { StatusCodes } from 'http-status-codes';
import { IImageFile } from '../../interface/IImageFile';
import sendResponse from '../../utils/sendResponse';
import tryCatchAsync from '../../utils/tryCatchAsync';
import { IJwtPayload } from '../auth/auth.interface';
import { mealServices } from './meal.service';

const handleCreateMeal = tryCatchAsync(async (req, res) => {
  const mealData = req.body;
  const image = req.file as IImageFile;
  const user = req.user as IJwtPayload;
  const result = await mealServices.createMal(mealData, image, user);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Meal created successfully',
    data: result,
  });
});

const handleUpdateMeal = tryCatchAsync(async (req, res) => {
  const id = req.params.id;
  const mealData = req.body;
  const image = req.file as IImageFile;
  const user = req.user as IJwtPayload;

  const result = await mealServices.updateMeal(id, mealData, image, user);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meal updated successfully',
    data: result,
  });
});

export const mealControllers = {
  handleCreateMeal,
  handleUpdateMeal,
};
