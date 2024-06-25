'use client';

import {getAllRecordsAsCsv, getRecordsTable} from '@/app/actions/record';
import {useLoader} from '@/hooks/useLoader';
import {useI18n} from '@/locales/client';
import {AuthedUser} from '@/utils/server/authUserId';
import {TableState} from '@/utils/server/TableUtils';
import {State} from '@/utils/State';
import {Box, BoxProps, Button, ButtonGroup, Paper, Stack} from '@mui/material';
import {DataGridProps, GridRowId} from '@mui/x-data-grid';
import React, {useCallback, useState} from 'react';
import {toast} from 'react-toastify';
import Datatable, {WithId} from './Datatable';
import {GlobalCsvExport} from './DatatableGlobalExport';
import Text from './Text';
import dayjs from 'dayjs';

interface TableOptions extends Omit<DataGridProps, 'rows'> {
  options?: Omit<DataGridProps, 'columns' | 'rows'>;
}

interface TableLayoutProps<InitialData, RowData> {
  user: AuthedUser;
  getter: (
    state: TableState
  ) => Promise<State<{data: InitialData[]; count: number}>>;
  setter?: (
    id: string,
    data: Partial<RowData>,
    include?: object
  ) => Promise<InitialData>;
  mapper?: (rows: InitialData) => RowData;
  add?: () => void;
  edit?: (id: string) => void;
  remove?: (id: string) => Promise<State>;
  tableOptions: TableOptions;
  additionalButtons?: React.ReactNode;
  model?: string;
  importMethod?: (data: FormData) => Promise<never>;
  globalCsvExport: GlobalCsvExport;
  empty?: () => Promise<never>;
  sx?: BoxProps['sx'];
}

/**
 * Datatable component
 */
function TableLayout<InitialData extends WithId, RowData extends WithId>({
  user,
  getter,
  setter,
  mapper,
  add,
  edit,
  remove,
  tableOptions,
  additionalButtons,
  model,
  importMethod,
  globalCsvExport,
  empty,
  sx,
  ...rest
}: TableLayoutProps<InitialData, RowData>) {
  const Loader = useLoader();
  const t = useI18n();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deleted, setDeleted] = useState(0);

  /**
   * Hack to reload data on delete
   */
  const handleGetter = useCallback(
    (params: TableState) => {
      return getter(params)
        .then(response => ({
          ...response,
          data: {
            data:
              response.data?.data.map(item => ({
                deleted, // Hack to force data reload on deletion, useless server-side
                ...(mapper ? mapper(item) : (item as unknown as RowData)),
              })) ?? [],
            count: response.data?.count ?? 0,
          },
        }))
        .catch((response: string) => {
          toast.error(response);
          return {data: {data: [], count: 0}};
        });
    },
    [deleted, getter, mapper]
  );

  // Enable/disable buttons based on row selection
  const handleSelection = useCallback((data: GridRowId[]) => {
    setSelectedRows(data as string[]);
  }, []);

  // Add button
  const handleAdd = useCallback(() => {
    if (add) add();
  }, [add]);

  // Edit button
  const handleEdit = useCallback(() => {
    if (edit) edit(selectedRows[0]);
  }, [edit, selectedRows]);

  // Delete button
  const handleDelete = useCallback(() => {
    if (remove) {
      Loader.open();
      const deletions: Promise<unknown>[] = [];
      selectedRows.forEach(featureToDelete => {
        deletions.push(remove(featureToDelete));
      });
      Promise.all(deletions)
        .then(() => {
          // Force reload the table data
          setDeleted(deleted + 1);
          Loader.close();
        })
        .catch((response: string) => {
          toast.error(response);
          Loader.close();
        });
    }
  }, [Loader, deleted, remove, selectedRows]);

  return (
    <Box sx={sx}>
      {(add || edit || remove) && (
        <ButtonGroup sx={{mb: 2, mr: 2}} variant="contained">
          {add && (
            <Button color="primary" onClick={handleAdd}>
              {t('table.add')}
            </Button>
          )}
          {edit && (
            <Button
              disabled={selectedRows.length !== 1}
              onClick={handleEdit}
              color="warning"
            >
              {t('table.edit')}
            </Button>
          )}
          {remove && (
            <Button
              disabled={selectedRows.length < 1}
              onClick={handleDelete}
              color="error"
            >
              {t('table.delete')}
            </Button>
          )}
        </ButtonGroup>
      )}
      {additionalButtons && <Box sx={{mb: 2}}>{additionalButtons}</Box>}
      <Paper sx={{display: 'flex'}}>
        <Box sx={{flexGrow: 1}}>
          <Datatable<InitialData, RowData>
            {...tableOptions}
            user={user}
            onSelectionModelChange={handleSelection}
            getter={handleGetter}
            setter={setter}
            globalCsvExport={globalCsvExport}
            importMethod={importMethod}
            empty={empty}
            {...rest}
          />
        </Box>
      </Paper>
      {model && (
        <Stack spacing={2} sx={{mt: 2}}>
          <Text h4>{t('actions.actionsHistory')}</Text>
          <TableLayout
            user={user}
            getter={getRecordsTable(model)}
            mapper={record => ({
              ...record,
              'author.person.firstName, author.person.lastName': `${record.author.person.firstName} ${record.author.person.lastName}`,
            })}
            globalCsvExport={{
              fetcher: getAllRecordsAsCsv(model),
              title: 'Record list',
            }}
            tableOptions={{
              columns: [
                {
                  field: 'author.person.firstName, author.person.lastName',
                  headerName: t('actions.user'),
                  flex: 1,
                },
                {
                  field: 'action',
                  headerName: t('actions.action'),
                  flex: 1,
                },
                {
                  field: 'date',
                  headerName: t('actions.date'),
                  flex: 1,
                  valueFormatter: ({value}) =>
                    dayjs(value as string).format('DD/MM/YYYY HH:mm'),
                },
              ],
            }}
          />
        </Stack>
      )}
    </Box>
  );
}

export default TableLayout;
