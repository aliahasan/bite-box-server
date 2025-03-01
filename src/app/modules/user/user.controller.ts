import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import tryCatchAsync from '../../utils/tryCatchAsync';
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

export const userControllers = {
  handleCreateUser,
};
