import { z } from 'zod';

const userLoginSchema = z.object({
  email: z
    .string({
      required_error: 'email is required',
    })
    .email({
      message: 'Invalid email address',
    }),
  password: z.string({
    required_error: 'Password is required',
  }),
});

export const authValidation = {
  userLoginSchema,
};
