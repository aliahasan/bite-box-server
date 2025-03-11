import { Router } from 'express';
import auth from '../../../middlewares/auth';
import { UserRole } from '../../user/user.interface';
import { ProviderMetaControllers } from './providerMeta.controller';

const router = Router();
router.get(
  '/',
  auth(UserRole.PROVIDER),
  ProviderMetaControllers.handleGetProviderMetaData
);

export const providerMetaRoutes = router;
