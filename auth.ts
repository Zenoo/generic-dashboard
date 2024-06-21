import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {z} from 'zod';
import {authConfig} from './auth.config';
import prisma from './prisma/prisma';

const AuthSchema = z.object({
  login: z.string().max(255),
  password: z.string().max(255),
});

export const {auth, signIn, signOut} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = AuthSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const {login, password} = parsedCredentials.data;
          const user = await prisma.user.findUnique({
            where: {login},
          });
          if (!user) {
            throw new Error('userNotFound');
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
});
