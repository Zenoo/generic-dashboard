'use client';

import {Delete, IosShare} from '@mui/icons-material';
import {Button} from '@mui/material';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarContainerProps,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import React, {useCallback} from 'react';
import {useLoader} from '../hooks/useLoader';
import DatatableExportButton from './DatatableExportButton';
import {GlobalCsvExport} from './DatatableGlobalExport';
import DropzoneDialog from './DropzoneDialog';
import {useScopedI18n} from '@/locales/client';
import {useConfirm} from '@/hooks/useConfirm';
import {toast} from 'react-toastify';

export interface DatatableToolbarProps extends GridToolbarContainerProps {
  globalCsvExport: GlobalCsvExport;
  importMethod?: (data: FormData) => Promise<never>;
  reload: () => void;
  empty?: () => Promise<never>;
}

function DatatableToolbar({
  globalCsvExport,
  importMethod,
  reload,
  empty,
  ...rest
}: DatatableToolbarProps) {
  const t = useScopedI18n('table');
  const Loader = useLoader();
  const Confirm = useConfirm();

  const uploadFile = useCallback(
    ([file]: File[]) => {
      if (!importMethod) {
        return;
      }

      Loader.open();
      const data = new FormData();
      data.set('file', file, file.name);

      importMethod(data)
        .then(() => {
          toast.success(t('importSuccess'));
        })
        .catch(error => {
          toast.error(error.message);
        })
        .finally(() => {
          reload();
          Loader.close();
        });
    },
    [Loader, importMethod, reload, t]
  );

  const confirmEmpty = useCallback(() => {
    if (!empty) {
      return;
    }

    Confirm.open(t('emptyTable'), t('emptyTableDescription'), () => {
      Loader.open();
      empty()
        .then(() => {
          toast.success(t('emptySuccess'));
          reload();
        })
        .catch(error => {
          toast.error(error.message);
        })
        .finally(() => {
          Loader.close();
        });
    });
  }, [Confirm, Loader, empty, reload, t]);

  return (
    <GridToolbarContainer {...rest}>
      <GridToolbarColumnsButton
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
      <GridToolbarFilterButton
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
      <GridToolbarDensitySelector
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
      <DatatableExportButton globalCsvExport={globalCsvExport} />
      {importMethod && (
        <DropzoneDialog
          accept={{'text/csv': ['.csv']}}
          onSave={uploadFile}
          title={t('import')}
          options={{maxFiles: 1}}
        >
          <Button size="small" startIcon={<IosShare />}>
            {t('import')}
          </Button>
        </DropzoneDialog>
      )}
      {empty && (
        <Button size="small" onClick={confirmEmpty} startIcon={<Delete />}>
          {t('empty')}
        </Button>
      )}
    </GridToolbarContainer>
  );
}

export default DatatableToolbar;
