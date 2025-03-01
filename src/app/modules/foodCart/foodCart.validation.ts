import { z } from 'zod';

export const foodCartSchema = z.object({
  foodCartName: z.string().min(1, 'Food cart name is required'),
  address: z.string().min(1, 'Address is required'),
  contactNumber: z
    .string()
    .min(6, 'Contact number must be at least 6 digits')
    .max(13, 'Contact number must be at most 13 digits'),
  description: z.string().min(10, 'Description is required'),
  cuisineSpecialties: z.array(z.string()),
  availability: z.object({
    days: z.string().min(1, 'Availability days are required'),
    hours: z.string().min(1, 'Availability hours are required'),
  }),
});

// TypeScript Type Inference (Optional)
// export type FoodCartType = z.infer<typeof FoodCartSchema>;

export const foodCartValidations = {
  foodCartSchema,
};
