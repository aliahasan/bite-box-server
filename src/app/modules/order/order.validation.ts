import { z } from 'zod';

const orderSchema = z.object({
  meal: z.string({
    required_error: 'Meal ID is required',
  }),
  quantity: z.number({
    required_error: 'Quantity is required',
  }),
  portionSize: z.string({
    required_error: 'Portion size is required',
  }),
});

const orderValidationSchema = z.object({
  meals: z.array(orderSchema),
  shippingAddress: z.string({
    required_error: 'Shipping address is required',
  }),
  paymentMethod: z.string({
    required_error: 'Payment method is required',
  }),
  foodCart: z.string({
    required_error: 'Food cart ID is required',
  }),
});

export const orderValidations = {
  orderValidationSchema,
};
