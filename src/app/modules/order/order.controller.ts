import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import tryCatchAsync from '../../utils/tryCatchAsync';
import { IJwtPayload } from '../auth/auth.interface';
import { OrderServices } from './order.service';

const handleCreateOrder = tryCatchAsync(async (req, res) => {
  const result = await OrderServices.createOrder(
    req.body,
    req.user as IJwtPayload
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

export const OrderControllers = {
  handleCreateOrder,
};
