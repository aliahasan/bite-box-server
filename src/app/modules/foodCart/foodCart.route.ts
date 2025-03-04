import { Router } from 'express';
import { multerUpload } from '../../config/multer.config';
import auth from '../../middlewares/auth';
import { parsedBody } from '../../middlewares/bodyParser';
import validateRequest from '../../middlewares/validateRequest';
import { UserRole } from '../user/user.interface';
import { fooCartControllers } from './foodCart.controller';
import { foodCartValidations } from './foodCart.validation';

const router = Router();

router.get(
  '/',
  auth(UserRole.PROVIDER),
  fooCartControllers.handleGetMyFoodCart
);

router.post(
  '/create',
  auth(UserRole.PROVIDER),
  multerUpload.single('image'),
  parsedBody,
  validateRequest(foodCartValidations.foodCartSchema),
  fooCartControllers.handleCreateFoodCart
);

router.patch(
  '/:id/update',
  auth(UserRole.PROVIDER),
  multerUpload.single('image'),
  parsedBody,
  validateRequest(foodCartValidations.updateFoodCartSchema),
  fooCartControllers.handleUpdateFoodCart
);

export const fooCartRoutes = router;
