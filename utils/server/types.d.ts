import {Prisma} from '@prisma/client';

type Model = 'user' | 'record';
type SelectObject<T extends Model> = T extends 'user'
  ? Prisma.UserSelect
  : T extends 'record'
    ? Prisma.RecordSelect
    : never;
