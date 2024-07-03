import {prisma} from '@/prisma/prisma';
import {RecordAction, RecordObject} from '@prisma/client';

export const newCreateRecord = async (
  userId: string,
  object: RecordObject,
  objectId: string,
  value: string
) => {
  await prisma.record.create({
    data: {
      action: RecordAction.CREATE,
      authorId: userId,
      object,
      objectId,
      newValue: value,
    },
  });
};

// Find the difference between two objects (recursively)
const getDiff = (
  previousObject: Record<string, unknown>,
  newObject: Record<string, unknown>
) => {
  const diff: Record<string, unknown> = {};

  Object.keys(newObject).forEach(key => {
    // If object is nested, call getDiff recursively, add dot notation to key
    if (typeof newObject[key] === 'object' && !Array.isArray(newObject[key])) {
      const nestedDiff = getDiff(
        previousObject[key] as Record<string, unknown>,
        newObject[key] as Record<string, unknown>
      );
      Object.keys(nestedDiff).forEach(nestedKey => {
        diff[`${key}.${nestedKey}`] = nestedDiff[nestedKey];
      });
    }

    if (previousObject[key] !== newObject[key]) {
      diff[key] = newObject[key];
    }
  });

  return diff;
};

export const newUpdateRecords = async (
  userId: string,
  object: RecordObject,
  objectId: string,
  previousObject: Record<string, unknown>,
  newObject: Record<string, unknown>
) => {
  const diff = getDiff(previousObject, newObject);

  await prisma.record.createMany({
    data: Object.keys(diff).map(key => ({
      action: RecordAction.UPDATE,
      authorId: userId,
      object,
      objectId,
      oldValue: String(previousObject[key]),
      newValue: String(diff[key]),
    })),
  });
};

export const newDeleteRecord = async (
  userId: string,
  object: RecordObject,
  objectId: string,
  value: string
) => {
  await prisma.record.create({
    data: {
      action: RecordAction.DELETE,
      authorId: userId,
      object,
      objectId,
      oldValue: value,
    },
  });
};

export const newLoginRecord = async (userId: string) => {
  await prisma.record.create({
    data: {
      action: RecordAction.LOGIN,
      authorId: userId,
      object: RecordObject.USER,
      objectId: userId,
    },
  });
};
