import { Router } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.interface';
import { providerControllers } from './provider.controller';

const router = Router();

router.get(
  '/',
  auth(UserRole.PROVIDER),
  providerControllers.handleGetMyFoodCartMeals
);
router.patch(
  '/:mealId',
  auth(UserRole.PROVIDER),
  providerControllers.handleUpdateMealStock
);

export const providerRoutes = router;
