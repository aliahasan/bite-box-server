import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import tryCatchAsync from '../../utils/tryCatchAsync';
import { IJwtPayload } from '../auth/auth.interface';
import { reviewService } from './review.service';

const handleCreateReview = tryCatchAsync(async (req, res) => {
  const foodCartId = req.params.foodCartId;
  const user = req.user as IJwtPayload;
  const payload = req.body;
  const result = await reviewService.createReview(foodCartId, payload, user);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'review  posted successfully',
    data: result,
  });
});

const handleGetAllReviews = tryCatchAsync(async (req, res) => {
  const result = await reviewService.getAllReviews();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'review  fetched successfully',
    data: result,
  });
});
export const reviewController = {
  handleCreateReview,
  handleGetAllReviews,
};
