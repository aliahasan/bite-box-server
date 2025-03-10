import { Router } from 'express';
import { multerUpload } from '../../config/multer.config';
import auth from '../../middlewares/auth';
import { parsedBody } from '../../middlewares/bodyParser';
import validateRequest from '../../middlewares/validateRequest';
import { UserRole } from '../user/user.interface';
import { mealControllers } from './meal.controller';
import { mealValidations } from './meal.validation';

const router = Router();

router.get('/', mealControllers.handleGetAllMeal);
router.get('/categories', mealControllers.handleGetAllCategories);
router.get('/cuisines', mealControllers.handleGetAllCuisines);
router.get('/:id', mealControllers.handleGetSingleMeal);

router.post(
  '/create-meal',
  auth(UserRole.PROVIDER),
  multerUpload.single('image'),
  parsedBody,
  validateRequest(mealValidations.createMealSchema),
  mealControllers.handleCreateMeal
);

router.patch(
  '/:id',
  auth(UserRole.PROVIDER),
  multerUpload.single('image'),
  parsedBody,
  validateRequest(mealValidations.updateMealSchema),
  mealControllers.handleUpdateMeal
);

router.delete(
  '/:id',
  auth(UserRole.PROVIDER),
  mealControllers.handleDeleteMeal
);

export const mealRoutes = router;
