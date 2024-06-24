import {prisma} from '@/prisma/prisma';
import {Model, SelectObject} from './types';

export interface MOCK_PrismaModel {
  create: (prop: {data: unknown; select: {id: true}}) => Promise<unknown>;
  findUnique: (prop?: object) => Promise<unknown>;
  findMany: (prop?: object) => Promise<unknown[]>;
  count: (prop: object) => Promise<number>;
  update: (prop: object) => Promise<unknown>;
  delete: (prop: object) => Promise<unknown>;
}

const filterOperatorMapper = {
  or: 'OR',
  and: 'AND',
};
const operatorMapper = {
  contains: 'contains',
  equals: 'equals',
  startsWith: 'startsWith',
  endsWith: 'endsWith',
  '=': 'equals',
  '!=': 'not',
  '>': 'gt',
  '>=': 'gte',
  '<': 'lt',
  '<=': 'lte',
  isAnyOf: 'in',
  is: 'equals',
  not: 'not',
  after: 'gt',
  onOrAfter: 'gte',
  before: 'lt',
  onOrBefore: 'lte',
  isEmpty: 'equals',
  isNotEmpty: 'not',
} as const;

export type TableSortDirection = 'asc' | 'desc';

export interface TableRequestBody<Select> {
  state: {
    page: number; // 0 based
    rowsPerPage: number;
    sortOrder?: {
      direction: TableSortDirection;
      name: string;
    };
    filters: {
      value: unknown;
      columnField: string;
      operatorValue: keyof typeof operatorMapper;
    }[];
    filtersOperator: 'or' | 'and';
  };
  select?: Select;
}

/**
 * Get data for the table request
 * @param req
 * @param model
 * @param where
 */
export const getData = async <T extends Model, Select extends SelectObject<T>>(
  query: TableRequestBody<Select>,
  model: T,
  where?: object
) => {
  const {
    state: {page, rowsPerPage, sortOrder, filters, filtersOperator},
    select,
  } = query;

  // Generate prisma filters
  const prismaFilters = filters.map(filter => {
    const operator = operatorMapper[filter.operatorValue];

    return {
      [filter.columnField]: {
        [operator]: filter.value,
      },
    };
  });

  const prismaModel = prisma[model];

  // Get objects
  const objects = await prismaModel.findMany({
    where: {
      [filterOperatorMapper[filtersOperator]]: prismaFilters,
      ...where,
    },
    orderBy: {[sortOrder?.name || 'id']: sortOrder?.direction || 'asc'},
    skip: page * rowsPerPage,
    take: rowsPerPage,
    select,
  });

  // Get total count
  const count = await prismaModel.count({
    where: {
      [filterOperatorMapper[filtersOperator]]: prismaFilters,
      ...where,
    },
  });

  return {
    data: objects,
    count,
  };
};
