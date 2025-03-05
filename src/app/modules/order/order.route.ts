import { Router } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.interface';
import { OrderControllers } from './order.controller';

const router = Router();

router.get(
  '/my-orders',
  auth(UserRole.CUSTOMER),
  OrderControllers.handleGetMyOrders
);
router.get(
  '/my-foodCart-orders',
  auth(UserRole.PROVIDER),
  OrderControllers.handleGetMyFoodCartOrders
);
//get order details by provider
router.get(
  '/:orderId',
  auth(UserRole.PROVIDER),
  OrderControllers.handleGetOrderDetails
);

// orders of customers

router.post(
  '/create-order',
  auth(UserRole.CUSTOMER),
  //   validateRequest(orderValidations.orderValidationSchema),
  OrderControllers.handleCreateOrder
);

router.patch('/:orderId/status', auth(UserRole.PROVIDER));

router.patch('/:orderId/request', auth(UserRole.PROVIDER));

export const orderRoutes = router;
