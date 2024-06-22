'use server';

import {prisma} from '@/prisma/prisma';
import {authUserId} from '@/utils/server/authUserId';

export const stats = async () => {
  await authUserId();

  const userCount = await prisma.user.count({
    where: {active: true},
  });

  return {
    users: userCount,
    stat2: Math.floor(Math.random() * 100),
    stat3: Math.floor(Math.random() * 100),
  };
};
