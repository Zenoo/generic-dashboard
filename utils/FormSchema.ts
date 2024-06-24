import {Lang} from '@prisma/client';
import {z} from 'zod';
import {zfd} from 'zod-form-data';

export const UpdateProfileSchema = zfd
  .formData({
    firstName: z.string().max(255),
    lastName: z.string().max(255),
    email: z.string().email().max(255),
    phone: z.string().max(255),
    password: z.string().max(255).optional(),
    passwordConfirm: z.string().max(255).optional(),
    lang: z.enum(Object.values(Lang) as [Lang, ...Lang[]]),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'login.passwordsMustMatch',
    path: ['passwordConfirm'],
  });

export type UpdateUserFields =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'password'
  | 'passwordConfirm'
  | 'lang';
