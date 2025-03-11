import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../utils/sendResponse';
import tryCatchAsync from '../../../utils/tryCatchAsync';
import { IJwtPayload } from '../../auth/auth.interface';
import { customerMetaService } from './customerMeta.service';

const handleGetCustomerMetaData = tryCatchAsync(async (req, res) => {
  const result = await customerMetaService.getCustomerMetaService(
    req.query,
    req.user as IJwtPayload
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meta data retrieved successfully',
    data: result,
  });
});

export const CustomerMetaControllers = {
  handleGetCustomerMetaData,
};
