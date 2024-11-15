import {z} from 'zod'

export const usernameValidation = z.string().min(2,"username must be atleast 2 characters").
max(2,"username must be at most 20 characters").
regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

export const signUpSchema = z.object({
  name: usernameValidation,

  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});