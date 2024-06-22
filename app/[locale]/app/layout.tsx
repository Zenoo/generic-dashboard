import {I18nProviderClient} from '@/locales/client';
import {Box} from '@mui/material';
import * as React from 'react';
import TopAndNavBar from './TopAndNavBar';
import {authUser} from '@/utils/server/authUserId';

export default async function Layout(props: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const user = await authUser();

  return (
    <Box
      sx={{
        bgcolor: 'background.dark',
        display: 'flex',
        height: 1,
        overflow: 'hidden',
        width: 1,
      }}
    >
      <I18nProviderClient locale={props.params.locale}>
        <TopAndNavBar user={user} />
      </I18nProviderClient>
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          overflow: 'hidden',
          pt: {
            xs: 7,
            sm: 8,
          },
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
            <Box
              sx={{
                bgcolor: 'background.dark',
                minHeight: 1,
                p: 2,
              }}
            >
              {props.children}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
