import { z } from 'zod';

const createMealSchema = z.object({
  name: z.string({
    required_error: 'Meal name is required',
  }),
  description: z.string({
    required_error: 'Description is required',
  }),
  price: z
    .number({
      required_error: 'Price is required',
    })
    .min(1),
  category: z.string({
    required_error: 'Category is required',
  }),
  dietaryPreferences: z.array(
    z
      .string({
        required_error: 'Dietary Preferences is required',
      })
      .optional()
  ),
  cuisine: z.string({
    required_error: 'Cuisine is required',
  }),
  ingredients: z.array(
    z.string({
      required_error: 'ingredients is required',
    })
  ),
  portionSize: z.array(
    z.string({
      required_error: 'Portion size is required',
    })
  ),
  averageRating: z
    .number({
      required_error: 'Average rating is required',
    })
    .min(1)
    .optional(),
});

const updateMealSchema = createMealSchema.partial();

export const mealValidations = {
  createMealSchema,
  updateMealSchema,
};
