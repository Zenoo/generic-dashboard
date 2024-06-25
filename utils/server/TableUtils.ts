import {GridFilterItem, GridLinkOperator} from '@mui/x-data-grid';

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
