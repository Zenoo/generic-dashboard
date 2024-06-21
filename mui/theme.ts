'use client';
import {createTheme} from '@mui/material/styles';
import {FontStyle} from '@mui/material/styles/createTypography';
import {Roboto} from 'next/font/google';
import {ThemeOptions} from './ThemeOptions';
import typography from './typography';

interface TypeTransition {
  time: string;
}

interface TypeScrollbar {
  main: string;
  hover: string;
}

declare module '@mui/material/styles' {
  interface TypeBackground {
    dark: string;
    whiteTransparent: string;
  }

  interface Palette {
    transition: TypeTransition;
    scrollbar: TypeScrollbar;
  }
  interface PaletteOptions {
    transition: TypeTransition;
    scrollbar: TypeScrollbar;
  }
  interface Typography {
    largeTextBackground: FontStyle;
    tinyTextBackground: FontStyle;
  }
}

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
