'use server';

import {prisma} from '@/prisma/prisma';
import {authUserId} from '@/utils/server/authUserId';
import {asCsv} from '@/utils/server/TableUtils';
import {handleError} from '@/utils/server/handleError';
import {
  filterOperatorMapper,
  operatorMapper,
  TableState,
} from '@/utils/server/TableUtils';
import {success} from '@/utils/State';
import {RecordObject} from '@prisma/client';

/**
 * Get records for a paginated table
 * @param model
 */
export const getRecordsTable = async (
  object: RecordObject | null,
  state: TableState
) => {
  try {
    await authUserId();

    const {page, rowsPerPage, sortOrder, filters, filtersOperator} = state;
    const where = object ? {object} : {};

    // Generate prisma filters
    const prismaFilters = filters.map(filter => {
      if (!filter.operatorValue) {
        return {};
      }

      const operator = operatorMapper[filter.operatorValue];

      if (!operator) {
        return {};
      }

      return {
        [filter.columnField]: {
          [operator]: filter.value,
        },
      };
    });

    // Get objects
    const objects = await prisma.record.findMany({
      where: {
        [filterOperatorMapper[filtersOperator]]: prismaFilters.length
          ? prismaFilters
          : undefined,
        ...where,
      },
      orderBy: {[sortOrder?.name || 'date']: sortOrder?.direction || 'desc'},
      skip: page * rowsPerPage,
      take: rowsPerPage,
      select: {
        id: true,
        author: {
          select: {
            person: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        action: true,
        objectId: true,
        oldValue: true,
        newValue: true,
        date: true,
      },
    });

    // Get total count
    const count = await prisma.record.count({
      where: {
        [filterOperatorMapper[filtersOperator]]: prismaFilters,
        ...where,
      },
    });

    return success(
      'server',
      {
        data: objects,
        count,
      },
      'dataLoaded'
    );
  } catch (error) {
    return handleError(error);
  }
};

export const getAllRecordsAsCsv = async (object: RecordObject | null) => {
  try {
    await authUserId();

    const objects = await prisma.record.findMany({
      where: object ? {object} : {},
    });

    if (!objects.length) {
      throw new Error('nothingToExport');
    }

    const csv = asCsv(objects);

    // Send CSV file
    return success('server', csv, 'dataLoaded');
  } catch (error) {
    return handleError(error);
  }
};
