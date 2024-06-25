'use client';

import {Box} from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  enUS,
  frFR,
  GridColumns,
  GridFilterItem,
  GridLinkOperator,
} from '@mui/x-data-grid';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {toast} from 'react-toastify';
import DatatableToolbar from './DatatableToolbar';
import {GlobalCsvExport} from './DatatableGlobalExport';
import {useScopedI18n} from '@/locales/client';
import {AuthedUser} from '@/utils/server/authUserId';
import {Lang} from '@prisma/client';
import {SortOrder, TableState} from '@/utils/server/TableUtils';
import {State} from '@/utils/State';

export interface WithId {
  id: string;
}

interface DatatableProps<InitialData, RowData>
  extends Omit<DataGridProps, 'columns' | 'rows'> {
  user: AuthedUser;
  getter: (
    state: TableState
  ) => Promise<State<{data: RowData[]; count: number}>>;
  setter?: (id: string, data: Partial<RowData>) => Promise<InitialData>;
  mapper?: (rows: InitialData) => RowData;
  columns: GridColumns;
  options?: Omit<DataGridProps, 'columns' | 'rows'>;
  globalCsvExport: GlobalCsvExport;
  importMethod?: (data: FormData) => Promise<never>;
  empty?: () => Promise<never>;
}

/**
 * Datatable component
 */
function Datatable<InitialData extends WithId, RowData extends WithId>({
  user,
  getter,
  columns,
  options,
  setter,
  mapper,
  globalCsvExport,
  importMethod,
  empty,
  ...rest
}: DatatableProps<InitialData, RowData>) {
  const t = useScopedI18n('table');

  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [filters, setFilters] = useState<GridFilterItem[]>([]);
  const [filtersOperator, setFiltersOperator] = useState<GridLinkOperator>(
    GridLinkOperator.And
  );
  const [data, setData] = useState<RowData[]>([]);

  const localeText = useMemo(
    () =>
      (user.lang === Lang.fr ? frFR : enUS).components.MuiDataGrid.defaultProps
        .localeText,
    [user.lang]
  );

  const tableOptions: Omit<DataGridProps, 'columns' | 'rows'> = {
    autoHeight: true,
    checkboxSelection: true,
    filterMode: 'server',
    loading: isLoading,
    page,
    pageSize: rowsPerPage,
    pagination: true,
    paginationMode: 'server',
    rowCount: count,
    rowsPerPageOptions: [5, 10, 20, 50, 100, 500, 1000, 2000, 5000],
    sortingMode: 'server',
    sortingOrder: ['asc', 'desc'],
    onSortModelChange: async param => {
      setLoading(true);
      let sort: SortOrder = null;
      if (param.length) {
        sort = {
          name: param[0].field,
          direction: param[0].sort ?? 'asc',
        };
      }

      setSortOrder(sort);
      const response = await getter({
        page,
        sortOrder: sort,
        rowsPerPage,
        filters,
        filtersOperator,
      });
      setData(response.data?.data || []);
      setCount(response.data?.count || 0);
      setLoading(false);
    },
    onPageChange: async newPage => {
      setLoading(true);
      setPage(newPage);
      const response = await getter({
        page: newPage,
        sortOrder,
        rowsPerPage,
        filters,
        filtersOperator,
      });
      setData(response.data?.data || []);
      setLoading(false);
    },
    onPageSizeChange: async numberOfRows => {
      setLoading(true);
      setRowsPerPage(numberOfRows);
      const response = await getter({
        page,
        sortOrder,
        rowsPerPage: numberOfRows,
        filters,
        filtersOperator,
      });
      setData(response.data?.data || []);
      setLoading(false);
    },
    onFilterModelChange: async params => {
      // Set value to 'x' for empty and notEmpty filters to bypass non null check server side
      const newFilters = params.items.map(item => ({
        ...item,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        value:
          item.operatorValue === 'isEmpty' ||
          item.operatorValue === 'isNotEmpty'
            ? 'x'
            : item.value,
      }));

      setLoading(true);
      setFilters(newFilters);
      setFiltersOperator(params.linkOperator || GridLinkOperator.And);
      const response = await getter({
        page,
        sortOrder,
        rowsPerPage,
        filters: newFilters,
        filtersOperator: params.linkOperator || GridLinkOperator.And,
      });

      setData(response.data?.data || []);
      setLoading(false);
    },
    processRowUpdate: async (row: RowData) => {
      if (setter) {
        const response = await setter(row.id, row);
        toast.success(t('updateSuccess'));
        return mapper ? mapper(response) : response;
      }

      return Promise.resolve(row);
    },
    onProcessRowUpdateError: () => {
      toast.error(t('updateError'));
    },
    ...options,
  };

  useEffect(() => {
    let isSubscribed = true;

    (async () => {
      setLoading(true);
      const response = await getter({
        page,
        sortOrder,
        rowsPerPage,
        filters,
        filtersOperator,
      });
      if (isSubscribed) {
        setData(response.data?.data || []);
        setCount(response.data?.count || 0);
        setLoading(false);
      }
    })().catch(error => {
      toast.error(error.message);
    });

    return () => {
      isSubscribed = false;
    };
  }, [filters, filtersOperator, getter, page, rowsPerPage, sortOrder]);

  const reload = useCallback(async () => {
    setLoading(true);
    const response = await getter({
      page,
      sortOrder,
      rowsPerPage,
      filters,
      filtersOperator,
    });
    setData(response.data?.data || []);
    setCount(response.data?.count || 0);
    setLoading(false);
  }, [filters, filtersOperator, getter, page, rowsPerPage, sortOrder]);

  return (
    <Box sx={{display: 'flex', height: 1}}>
      <Box
        sx={{
          flexGrow: 1,
          width: 1,
          '& .MuiDataGrid-toolbarContainer': {
            flexWrap: 'wrap',
          },
        }}
      >
        <DataGrid
          localeText={localeText}
          experimentalFeatures={{newEditingApi: true}}
          columns={columns}
          components={{
            Toolbar: DatatableToolbar,
          }}
          componentsProps={{
            toolbar: {
              globalCsvExport,
              importMethod,
              reload,
              empty,
            },
          }}
          rows={data}
          {...tableOptions}
          {...rest}
        />
      </Box>
    </Box>
  );
}

export default Datatable;
