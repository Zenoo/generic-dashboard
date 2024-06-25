'use server';

import {auth} from '@/auth';
import {prisma} from '@/prisma/prisma';

export const authUserId = async () => {
  const session = await auth();

  if (!session || !session.user.id) {
    throw new Error('unauthorized');
  }

  return session.user.id;
};

export const authUser = async () => {
  const userId = await authUserId();

  const user = await prisma.user.findUnique({
    where: {id: userId, active: true},
    select: {
      id: true,
      login: true,
      admin: true,
      lang: true,
      person: {
        select: {firstName: true, lastName: true},
      },
    },
  });

  if (!user) {
    throw new Error('unauthorized');
  }

  return user;
};

export type AuthedUser = Awaited<ReturnType<typeof authUser>>;
