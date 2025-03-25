import { StatusCodes } from 'http-status-codes';
import { IImageFile } from '../../interface/IImageFile';
import sendResponse from '../../utils/sendResponse';
import tryCatchAsync from '../../utils/tryCatchAsync';
import { IJwtPayload } from '../auth/auth.interface';
import { userServices } from './user.service';

const handleCreateUser = tryCatchAsync(async (req, res) => {
  const userdata = req.body;
  const result = await userServices.registerUser(userdata);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const handleGetProfile = tryCatchAsync(async (req, res) => {
  const result = await userServices.myProfile(req.user as IJwtPayload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const handleUpdateProfile = tryCatchAsync(async (req, res) => {
  const result = await userServices.updateProfile(
    req.body,
    req.file as IImageFile,
    req.user as IJwtPayload
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Profile updated successfully`,
    data: result,
  });
});

const handleUpdateUserStatus = tryCatchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await userServices.updateUserStatus(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `User is now ${result.isActive ? 'active' : 'inactive'}`,
    data: result,
  });
});

const handleUpdatePreferences = tryCatchAsync(async (req, res) => {
  const result = await userServices.updatePreferences(
    req.user as IJwtPayload,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `User preferences updated successfully`,
    data: result,
  });
});

export const userControllers = {
  handleCreateUser,
  handleGetProfile,
  handleUpdateProfile,
  handleUpdateUserStatus,
  handleUpdatePreferences,
};
