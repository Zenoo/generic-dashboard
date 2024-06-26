'use server';

import {prisma} from '@/prisma/prisma';
import {authUserId} from '@/utils/server/authUserId';
import {ServerError} from '@/utils/server/CustomErrors';
import {handleError, zodErrors} from '@/utils/server/handleError';
import {
  asCsv,
  filterOperatorMapper,
  generateFilters,
  TableState,
} from '@/utils/server/TableUtils';
import {State, success} from '@/utils/State';
import {Lang, Prisma} from '@prisma/client';
import bcrypt from 'bcrypt';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {z} from 'zod';
import {zfd} from 'zod-form-data';

const SCOPE = 'user';

const InsertUserSchema = zfd.formData({
  login: z.string().max(255),
  firstName: z.string().max(255),
  lastName: z.string().max(255),
  email: z.string().email().max(255),
  phone: z.string().max(255),
  password: z.string().max(255),
  lang: z.enum(Object.values(Lang) as [Lang, ...Lang[]]),
  admin: z
    .string()
    .nullish()
    .transform(value => value === 'on'),
});

type InsertUserFields =
  | 'login'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'password'
  | 'lang'
  | 'admin';

/**
 * Insert a new user in the database
 * @param model
 */
export const insertUser = async (
  prevState: State<undefined, InsertUserFields> | undefined,
  formData: FormData
): Promise<typeof prevState> => {
  try {
    await authUserId();

    const parsedFormData = InsertUserSchema.safeParse(formData);

    if (!parsedFormData.success) {
      return zodErrors(parsedFormData);
    }

    await prisma.user.create({
      data: {
        admin: parsedFormData.data.admin,
        lang: parsedFormData.data.lang,
        login: parsedFormData.data.login,
        password: await bcrypt.hash(parsedFormData.data.password, 10),
        person: {
          create: {
            firstName: parsedFormData.data.firstName,
            lastName: parsedFormData.data.lastName,
            email: parsedFormData.data.email,
            phone: parsedFormData.data.phone,
          },
        },
      },
      select: {id: true},
    });

    revalidatePath('/app/user/list');
    redirect('/app/user/list');
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get a user from the database
 * @param model
 */
export const getUser = async <Select extends Prisma.UserSelect>(
  id: string,
  select: Select
) => {
  try {
    await authUserId();

    if (!id) {
      throw new ServerError('noIDProvided');
    }

    const user = await prisma.user.findUnique({
      where: {id},
      select,
    });

    if (!user) {
      throw new ServerError('unknownObject');
    }

    return success('server', user, 'dataLoaded');
  } catch (error) {
    return handleError(error);
  }
};

/**
 * List users from the database
 * @param model
 */
export const listUsers = async () => {
  try {
    await authUserId();

    const objects = await prisma.user.findMany({
      select: {
        id: true,
        active: true,
        login: true,
        person: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return success('server', objects, 'dataLoaded');
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get users for a paginated table
 * @param model
 */
export const getUsersTable = async (state: TableState) => {
  try {
    await authUserId();

    const {page, rowsPerPage, sortOrder, filters, filtersOperator} = state;
    const where = {};

    // Generate prisma filters
    const prismaFilters = generateFilters(filters);

    // Get objects
    const objects = await prisma.user.findMany({
      where: {
        [filterOperatorMapper[filtersOperator]]: prismaFilters,
        ...where,
      },
      orderBy: {[sortOrder?.name || 'login']: sortOrder?.direction || 'asc'},
      skip: page * rowsPerPage,
      take: rowsPerPage,
      select: {
        id: true,
        login: true,
        active: true,
        person: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Get total count
    const count = await prisma.user.count({
      where: {
        [filterOperatorMapper[filtersOperator]]: prismaFilters,
        ...where,
      },
    });

    return success(
      'server',
      {
        data: objects,
        count,
      },
      'dataLoaded'
    );
  } catch (error) {
    return handleError(error);
  }
};

const UpdateProfileSchema = zfd
  .formData({
    login: z.string().max(255),
    firstName: z.string().max(255),
    lastName: z.string().max(255),
    email: z.string().email().max(255),
    phone: z.string().max(255),
    password: z.string().max(255).optional(),
    passwordConfirm: z.string().max(255).optional(),
    lang: z.enum(Object.values(Lang) as [Lang, ...Lang[]]),
    admin: z
      .string()
      .nullish()
      .transform(value => value === 'on'),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'login.passwordsMustMatch',
    path: ['passwordConfirm'],
  });

type UpdateUserFields =
  | 'login'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'password'
  | 'passwordConfirm'
  | 'lang'
  | 'admin';

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

    // Limit admin editing to admin
    if (parsedFormData.data.admin && !user.admin) {
      throw new ServerError('unauthorized');
    }

    // Check if login is already taken
    if (parsedFormData.data.login) {
      const userWithLogin = await prisma.user.count({
        where: {
          id: {not: id},
          login: parsedFormData.data.login,
        },
      });

      if (userWithLogin) {
        return {
          formErrors: {
            login: [{message: 'user.loginTaken'}],
          },
        };
      }
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
        admin: parsedFormData.data.admin,
        login: parsedFormData.data.login,
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

export const deleteUser = async (id: string) => {
  try {
    await authUserId();

    await prisma.user.delete({
      where: {id},
    });

    revalidatePath('/app/user/list');

    return success('server', undefined, 'success');
  } catch (error) {
    return handleError(error);
  }
};

export const getAllUsersAsCsv = async () => {
  try {
    await authUserId();

    const users = await prisma.user.findMany({
      select: {
        id: true,
        login: true,
        person: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!users.length) {
      throw new Error('nothingToExport');
    }

    const csv = asCsv(
      users.map(user => ({
        id: user.id,
        login: user.login,
        firstName: user.person.firstName,
        lastName: user.person.lastName,
      }))
    );

    // Send CSV file
    return success('server', csv, 'dataLoaded');
  } catch (error) {
    return handleError(error);
  }
};
