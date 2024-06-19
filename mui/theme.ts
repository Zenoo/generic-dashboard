'use client';
import {Roboto} from 'next/font/google';
import {createTheme} from '@mui/material/styles';
import {colors} from '@mui/material';
import typography from './typography';

const ThemeOptions = {
  palette: {
    background: {
      dark: '#F4F6F8',
      default: colors.common.white,
      paper: colors.common.white,
      whiteTransparent: 'rgba(255,255,255,0.6)',
    },
    primary: {
      main: '#2b3b98',
    },
    secondary: {
      main: '#f47723',
    },
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600],
    },
    transition: {
      time: '0.5s',
    },
    scrollbar: {
      main: 'rgba(0,0,0,.3)',
      hover: 'rgba(0,0,0,.5)',
    },
  },
  typography,
};

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  ...ThemeOptions,
  palette: {
    ...ThemeOptions.palette,
    mode: 'light',
  },
  typography: {
    ...typography,
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
