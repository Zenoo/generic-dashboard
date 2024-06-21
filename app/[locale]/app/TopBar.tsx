'user client';

import {logout} from '@/app/actions/dashboard';
import Logo from '@/components/Logo';
import {Input, Menu, Person} from '@mui/icons-material';
import {
  AppBar,
  AppBarProps,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
} from '@mui/material';
import Link from 'next/link';

type TopBarProps = AppBarProps & {
  setMobileNavOpen: (open: boolean) => void;
};

function TopBar({setMobileNavOpen, ...rest}: TopBarProps) {
  return (
    <AppBar elevation={0} {...rest}>
      <Toolbar>
        <Link href="/app/home">
          <Logo width={50} />
        </Link>
        <Box flexGrow={1} />
        <Box sx={{display: {xs: 'none', lg: 'block'}}}>
          <Link href="/app/account">
            <IconButton size="large">
              <Tooltip title="Account">
                <Person />
              </Tooltip>
            </IconButton>
          </Link>
          <IconButton
            color="inherit"
            size="large"
            onClick={async () => {
              await logout();
              window.location.reload();
            }}
          >
            <Tooltip title="Logout">
              <Input />
            </Tooltip>
          </IconButton>
        </Box>
        <IconButton
          color="inherit"
          onClick={() => setMobileNavOpen(true)}
          size="large"
          sx={{display: {lg: 'none', xs: 'block'}}}
        >
          <Menu />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
