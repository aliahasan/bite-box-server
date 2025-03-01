import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import tryCatchAsync from '../../utils/tryCatchAsync';
import { IJwtPayload } from '../auth/auth.interface';
import { foodCartServices } from './foodCart.service';

const handleCreateFoodCart = tryCatchAsync(async (req, res) => {
  const result = await foodCartServices.createFoodCart(
    req.body,
    req.user as IJwtPayload
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Food cart created successfully',
    data: result,
  });
});

export const fooCartControllers = {
  handleCreateFoodCart,
};
