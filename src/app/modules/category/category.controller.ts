import { StatusCodes } from 'http-status-codes';
import { IImageFile } from '../../interface/IImageFile';
import sendResponse from '../../utils/sendResponse';
import tryCatchAsync from '../../utils/tryCatchAsync';
import { IJwtPayload } from '../auth/auth.interface';
import { CategoryService } from './category.service';

const handleCreateCategory = tryCatchAsync(async (req, res) => {
  const result = await CategoryService.createCategory(
    req.body,
    req.file as IImageFile,
    req.user as IJwtPayload
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const handleGetAllCategory = tryCatchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategory(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'category are retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

export const CategoryController = {
  handleCreateCategory,
  handleGetAllCategory,
};
