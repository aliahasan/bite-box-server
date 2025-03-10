import { z } from 'zod';

const registerUserValidationSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.string().min(6).optional(),
});

const customerProfileUpdateSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  photo: z.string().optional(),
  deliveryAddress: z.string().optional(),
  preferredCuisine: z.string().optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  dietaryPreferences: z.array(z.string()).optional(),
});

const updatePreferencesSchema = z.object({
  preferredCuisines: z.string().optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  dietaryPreferences: z.array(z.string()).optional(),
  portion: z.string().optional(),
});

export const UserValidation = {
  registerUserValidationSchema,
  customerProfileUpdateSchema,
  updatePreferencesSchema,
};
