import {prisma} from '@/prisma/prisma';
import {authUserId} from '@/utils/server/authUserId';
import {ServerError} from '@/utils/server/CustomErrors';
import {handleError} from '@/utils/server/handleError';
import {
  getData,
  MOCK_PrismaModel,
  TableRequestBody,
} from '@/utils/server/TableUtils';
import {Model, SelectObject} from '@/utils/server/types';
import {State, success} from '@/utils/State';
import {PrismaClient} from '@prisma/client';
import {revalidatePath} from 'next/cache';

export interface GenericPrisma extends PrismaClient {
  [key: string]: unknown;
}

/**
 * Insert a new object in the database
 * @param model
 */
const insert =
  <T extends Model>(model: T) =>
  async (prevState: State | undefined, formData: FormData) => {
    try {
      await authUserId();

      const prismaModel = prisma[model] as unknown as MOCK_PrismaModel;
      const data = Array.from(formData.entries()).reduce(
        (obj, [key, value]) => {
          obj[key] = value;
          return obj;
        },
        {} as Record<string, unknown>
      );

      await prismaModel.create({
        data: data,
        select: {id: true},
      });

      revalidatePath(`/app/${model}/list`);

      return success('server', undefined, 'success');
    } catch (error) {
      return handleError(error);
    }
  };

/**
 * Get an object from the database
 * @param model
 */
const get =
  <T extends Model>(model: T) =>
  async <Select extends SelectObject<T>>(id: string, select: Select) => {
    try {
      await authUserId();

      if (!id) {
        throw new ServerError('noIDProvided');
      }

      const prismaModel = prisma[model];

      const object = await prismaModel.findUnique({
        where: {id},
        select,
      });

      if (!object) {
        throw new ServerError('unknownObject');
      }

      return success('server', object, 'dataLoaded');
    } catch (error) {
      return handleError(error);
    }
  };

/**
 * List objects from the database
 * @param model
 */
const list =
  <T extends Model>(model: T) =>
  async <Select extends SelectObject<T>>(where: object, select: Select) => {
    try {
      await authUserId();

      const prismaModel = prisma[model];

      const objects = await prismaModel.findMany({
        where,
        select,
      });

      return success('server', objects, 'dataLoaded');
    } catch (error) {
      return handleError(error);
    }
  };

/**
 * Get all objects from the database as a CSV
 * @param model
 */
const getAllAsCsv = (model: string) => async () => {
  try {
    await authUserId();

    const prismaModel = (prisma as GenericPrisma)[model] as MOCK_PrismaModel;

    const objects = (await prismaModel.findMany()) as Record<string, unknown>[];

    if (!objects.length) {
      throw new ServerError('nothingToExport');
    }

    // Create CSV file
    let csv = '';

    // Add headers
    const headers = Object.keys(objects[0]);
    csv += `${headers.join(';')}\n`;

    // Add rows
    objects.forEach(object => {
      const row = headers.map(header => object[header]);
      csv += `${row.join(';')}\n`;
    });

    // Send CSV file
    return success('server', csv, 'dataLoaded');
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get objects for a paginated table
 * @param model
 */
const table =
  <T extends Model>(model: T) =>
  async <Select extends SelectObject<T>>(query: TableRequestBody<Select>) => {
    try {
      await authUserId();

      const data = await getData(query, model, undefined);

      return success('server', data, 'dataLoaded');
    } catch (error) {
      return handleError(error);
    }
  };

/**
 * Update an object in the database
 * @param model
 */
const update =
  (model: string) =>
  async <Fields extends string>(
    id: string,
    prevState: State<undefined, Fields> | undefined,
    formData: FormData
  ): Promise<typeof prevState> => {
    try {
      await authUserId();

      const prismaModel = (prisma as GenericPrisma)[model] as MOCK_PrismaModel;

      const data = Array.from(formData.entries()).reduce(
        (obj, [key, value]) => {
          obj[key] = value;
          return obj;
        },
        {} as Record<string, unknown>
      );

      await prismaModel.update({
        where: {id: +id},
        data,
      });

      revalidatePath(`/app/${model}/list`);
      revalidatePath(`/app/${model}/edit/${id}`);

      return success('server', undefined, 'success');
    } catch (error) {
      return handleError(error);
    }
  };

const deleteObject = (model: string) => async (id: string) => {
  try {
    await authUserId();

    const prismaModel = (prisma as GenericPrisma)[model] as MOCK_PrismaModel;

    await prismaModel.delete({
      where: {id: +id},
    });

    revalidatePath(`/app/${model}/list`);

    return success('server', undefined, 'success');
  } catch (error) {
    return handleError(error);
  }
};

const REST = (model: Model) => ({
  insert: insert(model),
  get: get(model),
  list: list(model),
  getAllAsCsv: getAllAsCsv(model),
  table: table(model),
  update: update(model),
  deleteObject: deleteObject(model),
});

export default REST;
