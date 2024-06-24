import {Prisma} from '@prisma/client';

type Model = 'user';
type SelectObject<T extends Model> = T extends 'user'
  ? Prisma.UserSelect
  : never;
