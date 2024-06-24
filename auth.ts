import {User} from '@prisma/client';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {z} from 'zod';
import {authConfig} from './auth.config';
import {prisma} from './prisma/prisma';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: Pick<User, 'id' | 'login' | 'admin'>;
  }
}

const AuthSchema = z.object({
  login: z.string().max(255),
  password: z.string().max(255),
});

export const {auth, signIn, signOut} = NextAuth({
  ...authConfig,
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = AuthSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const {login, password} = parsedCredentials.data;
          const user = await prisma.user.findUnique({
            where: {login, active: true},
            select: {id: true, login: true, admin: true, password: true},
          });
          if (!user) {
            throw new Error('unknownUser');
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return {id: user.id, login: user.login, admin: user.admin};
          }
        }

        throw new Error('invalidCredentials');
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    session(data) {
      const userId = data.token.sub;
      if (!userId) return data.session;

      data.session.user.id = userId;

      return data.session;
    },
  },
});
