import {
  GridCsvExportMenuItem,
  GridToolbarExportContainer,
} from '@mui/x-data-grid';
import React from 'react';
import DatatableGlobalExport, {GlobalCsvExport} from './DatatableGlobalExport';
import {ButtonProps} from '@mui/material';

export interface DatatableExportButtonProps extends ButtonProps {
  globalCsvExport: GlobalCsvExport;
}

function DatatableExportButton({
  globalCsvExport,
  ...rest
}: DatatableExportButtonProps) {
  return (
    <GridToolbarExportContainer
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      {...rest}
    >
      <GridCsvExportMenuItem options={{utf8WithBom: false, delimiter: ';'}} />
      <DatatableGlobalExport globalCsvExport={globalCsvExport} />
    </GridToolbarExportContainer>
  );
}

export default DatatableExportButton;
