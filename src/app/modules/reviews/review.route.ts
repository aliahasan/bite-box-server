import { Router } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.interface';
import { reviewController } from './review.controller';

const router = Router();

router.post(
  '/:foodCartId',
  auth(UserRole.CUSTOMER),
  reviewController.handleCreateReview
);

export const reviewRoutes = router;
