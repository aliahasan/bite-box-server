import { StatusCodes } from 'http-status-codes';
import { IImageFile } from '../../interface/IImageFile';
import sendResponse from '../../utils/sendResponse';
import tryCatchAsync from '../../utils/tryCatchAsync';
import { IJwtPayload } from '../auth/auth.interface';
import { foodCartServices } from './foodCart.service';

const handleCreateFoodCart = tryCatchAsync(async (req, res) => {
  const result = await foodCartServices.createFoodCart(
    req.body,
    req.file as IImageFile,
    req.user as IJwtPayload
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Food cart created successfully',
    data: result,
  });
});

const handleGetAllFoodCarts = tryCatchAsync(async (req, res) => {
  const result = await foodCartServices.getAllFoodCarts(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Food carts are retrieved successfully',
    data: result.foodCarts,
    meta: result.meta,
  });
});

const handleGetSingleFoodCart = tryCatchAsync(async (req, res) => {
  const foodCartId = req.params.foodCartId;
  const result = await foodCartServices.getSingleFoodCart(foodCartId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'food cart fetched successfully',
    data: result,
  });
});

const handleGetMyFoodCart = tryCatchAsync(async (req, res) => {
  const result = await foodCartServices.getMyFoodCart(req.user as IJwtPayload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'My food cart fetched successfully',
    data: result,
  });
});

const handleUpdateFoodCart = tryCatchAsync(async (req, res) => {
  const result = await foodCartServices.updateFoodCart(
    req.params.id,
    req.body,
    req.file as IImageFile,
    req.user as IJwtPayload
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Food cart updated successfully',
    data: result,
  });
});

export const fooCartControllers = {
  handleCreateFoodCart,
  handleGetSingleFoodCart,
  handleGetAllFoodCarts,
  handleGetMyFoodCart,
  handleUpdateFoodCart,
};
