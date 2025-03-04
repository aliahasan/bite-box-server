import { z } from 'zod';

export const foodCartSchema = z.object({
  foodCartName: z.string().min(1, 'Food cart name is required'),
  address: z.string().min(1, 'Address is required'),
  contactNumber: z
    .string()
    .min(6, 'Contact number must be at least 6 digits')
    .max(13, 'Contact number must be at most 13 digits'),
  description: z.string().min(10, 'Description is required'),
  cuisines: z.array(
    z.string({
      required_error: 'Cuisines are required',
    })
  ),
  availability: z.object({
    days: z.string().min(1, 'Availability days are required'),
    hours: z.string().min(1, 'Availability hours are required'),
  }),
});

const updateFoodCartSchema = foodCartSchema.partial();

export const foodCartValidations = {
  foodCartSchema,
  updateFoodCartSchema,
};
