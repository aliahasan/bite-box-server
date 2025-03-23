import { z } from 'zod';

const createCategoryValidationSchema = z.object({
  name: z
    .string()
    .nonempty('Category name is required')
    .max(100, 'Category name should not exceed 100 characters'),
  description: z.string().optional(),
});

const updateCategoryValidationSchema = z.object({
  name: z
    .string()
    .max(100, 'Category name should not exceed 100 characters')
    .optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const categoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
