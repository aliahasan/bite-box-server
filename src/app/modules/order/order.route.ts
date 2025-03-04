import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserRole } from '../user/user.interface';
import { OrderControllers } from './order.controller';
import { orderValidations } from './order.validation';

const router = Router();

router.get('/my-foodCart-orders', auth(UserRole.PROVIDER));

router.get('/my-orders', auth(UserRole.CUSTOMER));

router.get('/:orderId', auth(UserRole.PROVIDER));

router.post(
  '/create-order',
  auth(UserRole.CUSTOMER),
  validateRequest(orderValidations.orderValidationSchema),
  OrderControllers.handleCreateOrder
);

router.patch('/:orderId/status', auth(UserRole.PROVIDER));

router.patch('/:orderId/request', auth(UserRole.PROVIDER));

export const orderRoutes = router;
