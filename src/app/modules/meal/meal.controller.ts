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

const handleGetAllMeal = tryCatchAsync(async (req, res) => {
  const result = await mealServices.getAllMeal(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meals are retrieved successfully',
    meta: result.meta,
    data: result.meals,
  });
});

// get all meals of food cart provider

const handleGetSingleMeal = tryCatchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await mealServices.getSingleMeal(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meal retrieved successfully',
    data: result,
  });
});

const handleUpdateMeal = tryCatchAsync(async (req, res) => {
  const id = req.params.id;
  const image = req.file as IImageFile;
  const user = req.user as IJwtPayload;

  const result = await mealServices.updateMeal(id, req.body, image, user);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meal updated successfully',
    data: result,
  });
});

const handleDeleteMeal = tryCatchAsync(async (req, res) => {
  const id = req.params.id;
  const user = req.user as IJwtPayload;
  const result = await mealServices.deleteMeal(id, user);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meal deleted successfully',
    data: result,
  });
});

const handleGetAllCategories = tryCatchAsync(async (req, res) => {
  const result = await mealServices.getAllCategories();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
});
const handleGetAllCuisines = tryCatchAsync(async (req, res) => {
  const result = await mealServices.getAllCuisines();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Cuisines retrieved successfully',
    data: result,
  });
});

export const mealControllers = {
  handleCreateMeal,
  handleGetAllMeal,
  handleGetSingleMeal,
  handleUpdateMeal,
  handleDeleteMeal,
  handleGetAllCategories,
  handleGetAllCuisines,
};
