import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authControllers } from './auth.controller';
import { authValidation } from './auth.validation';

const router = Router();

router.post(
  '/login',
  validateRequest(authValidation.userLoginSchema),
  authControllers.handleLoginUser
);

export const authRoutes = router;
