'use server';

import {prisma} from '@/prisma/prisma';
import {authUserId} from '@/utils/server/authUserId';
import {ServerError} from '@/utils/server/CustomErrors';
import {handleError, zodErrors} from '@/utils/server/handleError';
import {State, success} from '@/utils/State';
import bcrypt from 'bcrypt';
import {revalidatePath} from 'next/cache';
import REST from './REST';
import {zfd} from 'zod-form-data';
import {z} from 'zod';
import {Lang} from '@prisma/client';

const rest = REST('user');
export const insertUser = rest.insert;
export const getUser = rest.get;
export const listUsers = rest.list;
export const getAllUsersAsCsv = rest.getAllAsCsv;
export const getUsersTable = rest.table;
export const updateUser = rest.update;
export const deleteUser = rest.deleteObject;

const SCOPE = 'user';

const UpdateProfileSchema = zfd
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

type UpdateUserFields =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'password'
  | 'passwordConfirm'
  | 'lang';

// Update profile
export async function updateProfile(
  id: string,
  prevState: State<undefined, UpdateUserFields> | undefined,
  formData: FormData
): Promise<typeof prevState> {
  try {
    const userId = await authUserId();

    if (!id) {
      throw new ServerError('noIDProvided');
    }

    const parsedFormData = UpdateProfileSchema.safeParse(formData);

    if (!parsedFormData.success) {
      return zodErrors(parsedFormData);
    }

    const user = await prisma.user.findUnique({
      where: {id: userId, active: true},
      select: {id: true, admin: true},
    });

    if (!user) {
      throw new ServerError('unknownUser');
    }

    const userToUpdate = await prisma.user.findUnique({
      where: {id},
    });

    if (!userToUpdate) {
      throw new ServerError('userNotFound');
    }

    // Check if user is self or admin
    if (user.id !== id && !user.admin) {
      throw new ServerError('unauthorized');
    }

    // Update password if provided
    if (parsedFormData.data.password) {
      // Hash password
      const hashedPassword = await bcrypt.hash(
        parsedFormData.data.password,
        10
      );

      // Update user
      await prisma.user.update({
        where: {id: userToUpdate.id},
        data: {
          password: hashedPassword,
        },
      });
    }

    // Update user
    await prisma.user.update({
      where: {id: userToUpdate.id},
      data: {
        lang: parsedFormData.data.lang,
        person: {
          update: {
            firstName: parsedFormData.data.firstName,
            lastName: parsedFormData.data.lastName,
            email: parsedFormData.data.email,
            phone: parsedFormData.data.phone,
          },
        },
      },
      select: {
        id: true,
      },
    });

    revalidatePath('/app/user/list');
    revalidatePath(`/app/user/${id}/edit`);

    return success(SCOPE, undefined, 'profileUpdated');
  } catch (error) {
    return handleError(error, SCOPE);
  }
}
