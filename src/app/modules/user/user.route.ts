import { Router } from 'express';
import { multerUpload } from '../../config/multer.config';
import auth from '../../middlewares/auth';
import { parsedBody } from '../../middlewares/bodyParser';
import validateRequest from '../../middlewares/validateRequest';
import { userControllers } from './user.controller';
import { UserRole } from './user.interface';
import { UserValidation } from './user.validation';

const router = Router();

router.get(
  '/me',
  auth(UserRole.PROVIDER, UserRole.CUSTOMER),
  userControllers.handleGetProfile
);

router.post(
  '/register',
  validateRequest(UserValidation.registerUserValidationSchema),
  userControllers.handleCreateUser
);

router.patch(
  '/update-profile',
  auth(UserRole.CUSTOMER),
  multerUpload.single('image'),
  parsedBody,
  validateRequest(UserValidation.customerProfileUpdateSchema),
  userControllers.handleUpdateProfile
);

router.patch(
  '/update-preferences',
  auth(UserRole.CUSTOMER),
  validateRequest(UserValidation.updatePreferencesSchema),
  userControllers.handleUpdatePreferences
);

router.patch(
  '/:id/update-status',
  auth(UserRole.ADMIN),
  userControllers.handleUpdateUserStatus
);
export const userRoutes = router;
