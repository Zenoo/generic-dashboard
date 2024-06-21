import {getScopedI18n} from '@/locales/server';
import theme from '@/mui/theme';
import {ThemeOptions} from '@/mui/ThemeOptions';
import {GlobalStyles} from '@mui/material';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import shadows from '@mui/material/styles/shadows';
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
            <GlobalStyles
              styles={{
                '*': {
                  boxSizing: 'border-box',
                  margin: 0,
                  padding: 0,
                },
                html: {
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  height: '100%',
                  width: '100%',
                },
                body: {
                  backgroundColor: ThemeOptions.palette.background.dark,
                  height: '100%',
                  width: '100%',
                },
                '*::-webkit-scrollbar': {
                  width: '8px',
                },
                '*::-webkit-scrollbar-thumb': {
                  backgroundColor: ThemeOptions.palette.scrollbar.main,
                  borderRadius: '4px',
                },
                '*::-webkit-scrollbar-track': {
                  WebkitBoxShadow: shadows[2],
                },
                '*::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: ThemeOptions.palette.scrollbar.hover,
                },
                a: {
                  textDecoration: 'none',
                },
                '#root': {
                  height: '100%',
                  width: '100%',
                },
              }}
            />
            {props.children}
            <ToastContainer position="bottom-left" />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
