import {getScopedI18n} from '@/locales/server';
import theme from '@/mui/theme';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import * as React from 'react';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export async function generateMetadata() {
  const t = await getScopedI18n('common.meta');
  return {
    title: {
      template: '%s | Generic Dashboard',
      default: 'Generic Dashboard',
    },
    description: t('desc'),
  };
}

export default function RootLayout(props: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{enableCssLayer: true}}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {props.children}
            <ToastContainer position="bottom-left" />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
