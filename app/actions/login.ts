'use server';

import {signIn} from '@/auth';
import {AuthError} from 'next-auth';
import {z} from 'zod';
import {zfd} from 'zod-form-data';
import {State, StateErrors} from './State';

const AuthenticateSchema = zfd.formData({
  login: zfd.text(z.string().max(255)),
  password: zfd.text(z.string().max(255)),
});

type AuthenticateFields = 'login' | 'password';
export async function authenticate(
  prevState: State<AuthenticateFields> | undefined,
  formData: FormData
) {
  const parsedFormData = AuthenticateSchema.safeParse(formData);

  if (!parsedFormData.success) {
    return {
      errors: parsedFormData.error.flatten()
        .fieldErrors as StateErrors<AuthenticateFields>,
    } as const;
  }
  try {
    await signIn('credentials', {
      login: parsedFormData.data.login,
      password: parsedFormData.data.password,
      redirectTo: '/app',
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      if (
        error.type === 'CredentialsSignin' ||
        error.cause?.err?.message === 'userNotFound'
      ) {
        return {
          message: 'invalidCredentials',
        } as const;
      }
      return {
        message: 'genericError',
      } as const;
    }
    throw error;
  }
}

export async function sendPasswordResetMail(login: string) {
  if (!login) {
    return {
      message: 'pleaseEnterLogin',
    } as const;
  }

  console.log('TODO: Implement password reset logic');

  // TODO: Implement password reset logic

  return {};
}

const ResetPasswordSchema = z
  .object({
    password: z.string().max(255),
    passwordConfirm: z.string().max(255),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'passwordsMustMatch',
    path: ['passwordConfirm'],
  });

export async function resetPassword(
  login: string,
  code: string,
  prevState: State<'password' | 'passwordConfirm'> | undefined,
  formData: FormData
) {
  if (!login || !code) {
    return {
      message: 'invalidResetCode',
    } as const;
  }

  const parsedFormData = ResetPasswordSchema.safeParse(formData);

  if (!parsedFormData.success) {
    return {
      errors: parsedFormData.error.flatten().fieldErrors,
    } as const;
  }

  console.log('TODO: Implement password reset logic');

  // TODO
  return {};
}
