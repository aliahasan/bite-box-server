import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserRole } from '../user/user.interface';
import { fooCartControllers } from './foodCart.controller';
import { foodCartValidations } from './foodCart.validation';

const router = Router();

router.post(
  '/create',
  auth(UserRole.CUSTOMER),
  validateRequest(foodCartValidations.foodCartSchema),
  fooCartControllers.handleCreateFoodCart
);

export const fooCartRoutes = router;
