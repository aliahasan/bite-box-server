import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import tryCatchAsync from '../../utils/tryCatchAsync';
import { IJwtPayload } from '../auth/auth.interface';
import { OrderServices } from './order.service';

// create a order by user / customer
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

// get all order of meal provider / food cart
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
    data: result.orders,
    meta: result.meta,
  });
});

// update order status by meal provider
const handleUpdateOrderStatus = tryCatchAsync(async (req, res) => {
  const orderId = req.params.orderId;
  const result = await OrderServices.updateOrderStatus(orderId, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order Status updated successfully',
    data: result,
  });
});

export const OrderControllers = {
  handleCreateOrder,
  handleGetMyFoodCartOrders,
  handleGetOrderDetails,
  handleGetMyOrders,
  handleUpdateOrderStatus,
};
