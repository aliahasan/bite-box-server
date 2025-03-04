import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../config';
import AppError from '../../errors/appError';
const store_id = config.ssl.store_id as string;
const store_password = config.ssl.store_pass as string;

const is_live = false;

const initPayment = async (paymentData: {
  total_amount: number;
  tran_id: string;
}) => {
  const { total_amount, tran_id } = paymentData;
  const data = {
    total_amount,
    currency: 'BDT',
    tran_id, // Use unique tran_id for each API call
    success_url: `${config.ssl.success_url}?tran_id=${tran_id}`,
    fail_url: config.ssl.failed_url as string,
    cancel_url: config.ssl.cancel_url as string,
    ipn_url: 'http://localhost:8000/api/v1/ssl/ipn',
    shipping_method: 'Courier',
    product_name: 'N/A.',
    product_category: 'N/A',
    product_profile: 'general',
    cus_name: 'N/A',
    cus_email: 'N/A',
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    ship_name: 'N/A',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };
  const sslcommerz = new SSLCommerzPayment(store_id, store_password, is_live);
  try {
    const apiResponse = await sslcommerz.init(data);
    const GatewayPageURL = apiResponse.GatewayPageURL;
    console.log(GatewayPageURL);

    if (GatewayPageURL) {
      return GatewayPageURL;
    } else {
      throw new AppError(
        StatusCodes.BAD_GATEWAY,
        'Failed to generate payment gateway URL.'
      );
    }
  } catch (error) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'An error occurred while processing payment.'
    );
  }
};

//validate payment gateway
const validatePaymentService = async (tran_id: string): Promise<boolean> => {
  const sslcommerz = new SSLCommerzPayment(store_id, store_password, is_live);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //@ts-ignore
    const validateResponse = await sslcommerz.transactionQueryByTransactionId({
      tran_id,
    });
    console.log(validateResponse.element);

    let data;

    if (
      validateResponse.element[0].status === 'VALID' ||
      validateResponse.element[0].status === 'VALIDATED'
    ) {
      data = {
        status: 'Paid',
        gatewayResponse: validateResponse.element[0],
      };
    } else if (validateResponse.element[0].status === 'INVALID_TRANSACTION') {
      data = {
        status: 'Failed',
        gatewayResponse: validateResponse.element[0],
      };
    } else {
      data = {
        status: 'Failed',
        gatewayResponse: validateResponse.element[0],
      };
    }
    //  const updateOrder = await Order.findByIdAndUpdate()
    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return false;
  }
};

export const sslService = {
  initPayment,
  validatePaymentService,
};
