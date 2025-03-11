import { Router } from 'express';
import auth from '../../../middlewares/auth';
import { UserRole } from '../../user/user.interface';
import { CustomerMetaControllers } from './customerMeata.controller';

const router = Router();

router.get(
  '/',
  auth(UserRole.CUSTOMER),
  CustomerMetaControllers.handleGetCustomerMetaData
);

export const customerMetaRoutes = router;
