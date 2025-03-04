import { Router } from 'express';
import { multerUpload } from '../../config/multer.config';
import auth from '../../middlewares/auth';
import { parsedBody } from '../../middlewares/bodyParser';
import validateRequest from '../../middlewares/validateRequest';
import { UserRole } from '../user/user.interface';
import { mealControllers } from './meal.controller';
import { mealValidations } from './meal.validation';

const router = Router();

router.post(
  '/create-meal',
  auth(UserRole.PROVIDER),
  multerUpload.single('image'),
  parsedBody,
  validateRequest(mealValidations.createMealSchema),
  mealControllers.handleCreateMeal
);

export const mealRoutes = router;
