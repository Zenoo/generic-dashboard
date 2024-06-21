'use server';

import {auth} from '@/auth';
import prisma from '@/prisma/prisma';

export const getUser = async (authMethod: typeof auth) => {
  const session = await authMethod();
  if (!session) return null;

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: {id: userId, active: true},
    select: {id: true, login: true, admin: true},
  });

  if (!user) {
    return null;
  }

  return user;
};
