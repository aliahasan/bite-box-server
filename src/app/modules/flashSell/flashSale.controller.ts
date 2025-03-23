import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import tryCatchAsync from '../../utils/tryCatchAsync';
import { IJwtPayload } from '../auth/auth.interface';
import { FlashSaleService } from './flashSale.service';

const createFlashSale = tryCatchAsync(async (req, res) => {
  const result = await FlashSaleService.createFlashSale(
    req.body,
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Flash Sale created successfully',
    data: result,
  });
});

const getActiveFlashSalesService = tryCatchAsync(async (req, res) => {
  const result = await FlashSaleService.getActiveFlashSalesService(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Flash Sale created successfully',
    meta: result.meta,
    data: result.result,
  });
});

export const FlashSaleController = {
  createFlashSale,
  getActiveFlashSalesService,
};
