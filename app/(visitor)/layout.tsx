import {Box} from '@mui/material';
import * as React from 'react';
import TopBar from './TopBar';

export default function Layout(props: {children: React.ReactNode}) {
  return (
    <Box
      sx={{
        bgcolor: 'background.dark',
        display: 'flex',
        height: 1,
        width: 1,
        overflow: 'hidden',
      }}
    >
      <TopBar />
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          overflow: 'hidden',
          pt: '64px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              flex: '1 1 auto',
              height: 1,
              overflow: 'auto',
            }}
          >
            {props.children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
