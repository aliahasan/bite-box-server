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

const handleGetMyFoodCartOrders = tryCatchAsync(async (req, res) => {
  const result = await OrderServices.getMyFoodCartOrders(
    req.query,
    req.user as IJwtPayload
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

//for meal provider only
const handleGetOrderDetails = tryCatchAsync(async (req, res) => {
  const orderId = req.params.orderId;
  const result = await OrderServices.getOrderDetails(orderId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order details retrieved successfully',
    data: result,
  });
});

//customers all orders
const handleGetMyOrders = tryCatchAsync(async (req, res) => {
  const result = await OrderServices.getMyOrders(
    req.query,
    req.user as IJwtPayload
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order details retrieved successfully',
    data: result,
  });
});

export const OrderControllers = {
  handleCreateOrder,
  handleGetMyFoodCartOrders,
  handleGetOrderDetails,
  handleGetMyOrders,
};
