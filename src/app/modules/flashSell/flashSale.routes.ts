import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserRole } from '../user/user.interface';
import { FlashSaleController } from './flashSale.controller';
import { flashSaleValidations } from './flashSale.validation';

const router = Router();

router.get('/', FlashSaleController.getActiveFlashSalesService);

router.post(
  '/',
  auth(UserRole.PROVIDER),
  validateRequest(flashSaleValidations.createFlashSaleSchema),
  FlashSaleController.createFlashSale
);

export const flashSaleRoutes = router;
