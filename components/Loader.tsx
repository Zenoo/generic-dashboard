import {Box, CircularProgress, CircularProgressProps} from '@mui/material';
import React from 'react';

export function Loader(props: CircularProgressProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 1,
      }}
    >
      <CircularProgress {...props} />
    </Box>
  );
}
