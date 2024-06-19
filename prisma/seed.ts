import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Check if DB is empty
  const count = await prisma.user.count();

  if (count > 0) {
    console.warn('DB is not empty, skipping seeding');
    return;
  }

  await prisma.user.create({
    data: {
      login: 'admin',
      admin: true,
      password: await bcrypt.hash('admin', 10),
      active: true,
      person: {
        create: {
          firstName: 'Foo',
          lastName: 'Bar',
          email: 'foo@b.ar',
        },
      },
    },
    select: { id: true },
  });

  await prisma.user.create({
    data: {
      login: 'test',
      password: await bcrypt.hash('test', 10),
      active: true,
      person: {
        create: {
          firstName: 'Test',
          lastName: 'Test',
          email: 'test@test.te',
        },
      },
    },
    select: { id: true },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
