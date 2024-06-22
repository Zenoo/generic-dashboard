'use server';

import {signIn} from '@/auth';
import {getScopedI18n} from '@/locales/server';
import {prisma} from '@/prisma/prisma';
import {State, success} from '@/utils/State';
import {ExpectedError, ServerError} from '@/utils/server/CustomErrors';
import {
  MAIL_SENDER,
  passwordResetTemplate,
  sendMail,
} from '@/utils/server/MailUtils';
import {handleError, zodErrors} from '@/utils/server/handleError';
import bcrypt from 'bcrypt';
import {z} from 'zod';
import {zfd} from 'zod-form-data';

const SCOPE = 'login';

const AuthenticateSchema = zfd.formData({
  login: zfd.text(z.string().max(255)),
  password: zfd.text(z.string().max(255)),
});

type AuthenticateFields = 'login' | 'password';

// Authenticate user
export async function authenticate(
  prevState: State<AuthenticateFields> | undefined,
  formData: FormData
): Promise<typeof prevState> {
  const parsedFormData = AuthenticateSchema.safeParse(formData);

  if (!parsedFormData.success) {
    return zodErrors(parsedFormData);
  }

  try {
    await signIn('credentials', {
      login: parsedFormData.data.login,
      password: parsedFormData.data.password,
      redirectTo: '/app',
    });
    return {};
  } catch (error) {
    return handleError(error, SCOPE);
  }
}

// Send password reset email
export async function sendPasswordResetMail(login: string): Promise<State> {
  try {
    if (!login) {
      throw new ExpectedError('pleaseEnterLogin');
    }

    const user = await prisma.user.findUnique({
      where: {login, active: true},
      select: {
        id: true,
        person: {select: {email: true}},
      },
    });

    if (!user) {
      return success(SCOPE, 'passwordResetMailSent');
    }

    // Generate token
    const token = await bcrypt.hash(`${user.id}`, 10);

    const appUrl = process.env.APP_URL;

    if (!appUrl) {
      throw new ServerError('appUrlNotSet');
    }

    // Reset URL
    const url = `${process.env.APP_URL}/?login=${encodeURIComponent(
      login
    )}&reset=${encodeURIComponent(token)}`;

    console.log(url);

    const t = await getScopedI18n('server');

    // // Send email
    const mailInfo = await sendMail(t, {
      from: MAIL_SENDER,
      to: user.person.email,
      subject: t('resetYourPassword'),
      text: `${t('clickLinkToResetPassword')}: ${url}`,
      html: passwordResetTemplate(t, url),
    });

    if (mailInfo.accepted.length === 0) {
      throw new Error('server.emailNotSent');
    }

    return success(SCOPE, 'passwordResetMailSent');
  } catch (error) {
    return handleError(error, SCOPE);
  }
}

// Check if reset code is valid
export async function checkResetCodeValidity(
  login: string,
  code: string
): Promise<State> {
  try {
    if (!login || !code) {
      throw new ExpectedError('invalidResetCode');
    }

    const user = await prisma.user.findFirst({
      where: {login, active: true},
      select: {id: true},
    });

    if (!user) {
      throw new ExpectedError('invalidResetCode');
    }

    // Check if token is valid
    const tokenIsValid = await bcrypt.compare(`${user.id}`, code);

    if (!tokenIsValid) {
      throw new ExpectedError('invalidResetCode');
    }

    return {};
  } catch (error) {
    return handleError(error, SCOPE);
  }
}

const ResetPasswordSchema = zfd
  .formData({
    password: z.string().max(255),
    passwordConfirm: z.string().max(255),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'login.passwordsMustMatch',
    path: ['passwordConfirm'],
  });

type ResetPasswordFields = 'password' | 'passwordConfirm';

// Reset password
export async function resetPassword(
  login: string,
  code: string,
  prevState: State<ResetPasswordFields> | undefined,
  formData: FormData
): Promise<typeof prevState> {
  try {
    if (!login || !code) {
      throw new ExpectedError('invalidResetCode');
    }

    const parsedFormData = ResetPasswordSchema.safeParse(formData);

    if (!parsedFormData.success) {
      return zodErrors(parsedFormData);
    }

    const user = await prisma.user.findFirst({
      where: {login, active: true},
      select: {id: true},
    });

    if (!user) {
      throw new ExpectedError('invalidResetCode');
    }

    // Check if token is valid
    const tokenIsValid = await bcrypt.compare(`${user.id}`, code);
    if (!tokenIsValid) {
      throw new ExpectedError('invalidResetCode');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(parsedFormData.data.password, 10);

    // Update user
    await prisma.user.update({
      where: {id: user.id},
      data: {
        password: hashedPassword,
      },
    });

    return success(SCOPE, 'passwordUpdated');
  } catch (error) {
    return handleError(error, SCOPE);
  }
}
