import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userControllers } from './user.controller';
import { UserValidation } from './user.validation';

const router = Router();

router.post(
  '/register',
  validateRequest(UserValidation.userValidationSchema),
  userControllers.handleCreateUser
);

export const userRoutes = router;
