'use client';

import {useLoader} from '@/hooks/useLoader';
import {useI18n} from '@/locales/client';
import {State} from '@/utils/State';
import {MenuItem} from '@mui/material';
import {GridExportMenuItemProps} from '@mui/x-data-grid';
import {useCallback} from 'react';
import {toast} from 'react-toastify';

export type GlobalCsvExport = {
  fetcher: () => Promise<State<string, undefined>>;
  title: string;
};

export interface DatatableGlobalExportProps
  extends GridExportMenuItemProps<Record<string, unknown>> {
  globalCsvExport: GlobalCsvExport;
}

function DatatableGlobalExport({
  hideMenu,
  globalCsvExport,
}: DatatableGlobalExportProps) {
  const t = useI18n();
  const Loader = useLoader();

  const globalExport = useCallback(() => {
    Loader.open();
    const blobPromise = globalCsvExport.fetcher().catch(error => {
      console.error(error);
      toast.error(error.message);
    });

    Loader.close();

    blobPromise
      .then(state => {
        if (!state?.data) {
          toast.error(t('server.internalError'));
          return;
        }

        // Download file
        const url = window.URL.createObjectURL(new Blob([state.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${globalCsvExport.title}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Hide the export menu after the export
        hideMenu?.();
      })
      .catch(error => {
        console.error(error);
        toast.error(error.message);
      });
  }, [Loader, globalCsvExport, hideMenu, t]);

  return <MenuItem onClick={globalExport}>{t('table.globalExport')}</MenuItem>;
}

export default DatatableGlobalExport;
