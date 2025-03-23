import { z } from 'zod';

const createFlashSaleSchema = z.object({
  meals: z.array(z.string()).nonempty('At least one meal is required'),
  discountPercentage: z
    .number()
    .min(1, 'Discount percentage must be at least 1')
    .max(100, 'Discount percentage cannot exceed 100'),
});

export const flashSaleValidations = {
  createFlashSaleSchema,
};
