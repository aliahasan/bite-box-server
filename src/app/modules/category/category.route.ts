import { Router } from 'express';
import { multerUpload } from '../../config/multer.config';
import auth from '../../middlewares/auth';
import { parsedBody } from '../../middlewares/bodyParser';
import validateRequest from '../../middlewares/validateRequest';
import { UserRole } from '../user/user.interface';
import { CategoryController } from './category.controller';
import { categoryValidation } from './category.validation';

const router = Router();

router.get('/', CategoryController.handleGetAllCategory);

router.post(
  '/',
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  multerUpload.single('image'),
  parsedBody,
  validateRequest(categoryValidation.createCategoryValidationSchema),
  CategoryController.handleCreateCategory
);

export const categoryRoutes = router;
