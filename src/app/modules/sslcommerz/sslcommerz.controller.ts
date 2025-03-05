import config from '../../config';
import tryCatchAsync from '../../utils/tryCatchAsync';
import { sslService } from './sslcommerz.service';

const validatePaymentService = tryCatchAsync(async (req, res) => {
  const tran_id = req.query.tran_id as string;
  const result = await sslService.validatePaymentService(tran_id);
  if (result) {
    res.redirect(301, config.ssl.success_url as string);
  } else {
    res.redirect(301, config.ssl.failed_url as string);
  }
});

export const SSLController = {
  validatePaymentService,
};
