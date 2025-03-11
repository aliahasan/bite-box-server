import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../utils/sendResponse';
import tryCatchAsync from '../../../utils/tryCatchAsync';
import { IJwtPayload } from '../../auth/auth.interface';
import { ProviderMetaService } from './providerMeta.service';

const handleGetProviderMetaData = tryCatchAsync(async (req, res) => {
  const result = await ProviderMetaService.getProviderMetaData(
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

export const ProviderMetaControllers = {
  handleGetProviderMetaData,
};
