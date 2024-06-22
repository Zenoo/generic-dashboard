import {Message, State, error as createError} from '@/utils/State';
import {AuthError} from 'next-auth';
import {z} from 'zod';
import {ExpectedError, ServerError} from './CustomErrors';

export const handleError = (error: unknown, scope: string): State => {
  if (error instanceof AuthError) {
    if (
      error.type === 'CredentialsSignin' ||
      error.cause?.err?.message === 'userNotFound' ||
      error.cause?.err?.message === 'invalidCredentials'
    ) {
      return createError('login', 'invalidCredentials');
    }
    return createError('common', 'genericError');
  }

  if (error instanceof ExpectedError) {
    return createError(scope, error.message);
  }

  if (error instanceof ServerError) {
    return createError('server', error.message);
  }

  if (error instanceof Error) {
    // Let Next redirects through
    if (error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error(error);
    return createError(null, error.message);
  }

  console.error(error);
  return createError('common', 'genericError');
};

export const zodErrors = (data: z.SafeParseError<FormData>) => {
  return {
    formErrors: data.error.errors.reduce(
      (acc, error) => {
        const key = error.path.join('.');
        if (!acc[key]) {
          acc[key] = [];
        }
        switch (error.code) {
          case 'too_small':
            acc[key].push({
              message: 'common.input.min',
              params: {number: error.minimum},
            });
            break;
          case 'too_big':
            acc[key].push({
              message: 'common.input.max',
              params: {number: error.maximum},
            });
            break;
          case 'custom':
            acc[key].push({message: error.message});
            break;
          default:
            acc[key].push({message: 'common.input.invalid'});
            break;
        }
        return acc;
      },
      {} as Record<string, Message[]>
    ),
  };
};
