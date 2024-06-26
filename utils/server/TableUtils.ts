import {GridFilterItem, GridLinkOperator} from '@mui/x-data-grid';
import {ServerError} from './CustomErrors';

export interface MOCK_PrismaModel {
  create: (prop: {data: unknown; select: {id: true}}) => Promise<unknown>;
  findUnique: (prop?: object) => Promise<unknown>;
  findMany: (prop?: object) => Promise<unknown[]>;
  count: (prop: object) => Promise<number>;
  update: (prop: object) => Promise<unknown>;
  delete: (prop: object) => Promise<unknown>;
}

export const filterOperatorMapper = {
  or: 'OR',
  and: 'AND',
};
export const operatorMapper: Record<string, string | undefined> = {
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
};

const caseInsensitiveOperators = [
  'contains',
  'equals',
  'startsWith',
  'endsWith',
];

export type TableSortDirection = 'asc' | 'desc';
export type SortOrder = {
  direction: TableSortDirection;
  name: string;
} | null;

export interface TableState {
  page: number; // 0 based
  rowsPerPage: number;
  sortOrder?: SortOrder;
  filters: GridFilterItem[];
  filtersOperator: GridLinkOperator;
}

/**
 * Transform an array of objects into a CSV string
 * @param model
 */
export const asCsv = (objects: Record<string, unknown>[]) => {
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

  // Send CSV data
  return csv;
};

// Helper to generate the filter tree for dot notation filters
// Ex: person.firstName => {person: {firstName: { [operator]: filter.value }}}
const generateFilterTree = (
  filter: GridFilterItem
): Record<string, unknown> => {
  const [first, ...rest] = filter.columnField.split('.');
  if (!rest.length) {
    if (!filter.operatorValue || typeof filter.value === 'undefined') {
      return {};
    }

    const operator = operatorMapper[filter.operatorValue];

    if (!operator) {
      return {};
    }

    const object = {
      [first]: {
        [operator]: filter.value,
      },
    };

    // Case insensitive operators
    if (caseInsensitiveOperators.includes(filter.operatorValue)) {
      object[first].mode = 'insensitive';
    }

    return object;
  }

  return {
    [first]: generateFilterTree({
      ...filter,
      columnField: rest.join('.'),
    }),
  };
};

/**
 * Generate filters for the prisma query
 * @param filters
 */
export const generateFilters = (filters: GridFilterItem[]) => {
  return filters.map(filter => generateFilterTree(filter));
};
