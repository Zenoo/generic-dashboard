import Logo from '@/components/Logo';
import {AppBar, Toolbar} from '@mui/material';
import Link from 'next/link';
import React from 'react';

function TopBar({...rest}) {
  return (
    <AppBar elevation={0} {...rest}>
      <Toolbar sx={{height: 64}}>
        <Link href="/">
          <Logo />
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
