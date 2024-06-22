'use client';

import {useState} from 'react';
import TopBar from './TopBar';
import NavBar from './NavBar';
import {AuthedUser} from '@/utils/server/authUserId';

function TopAndNavBar({user}: {user: AuthedUser}) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <TopBar setMobileNavOpen={setMobileNavOpen} />
      <NavBar
        isMobileNavOpen={isMobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        user={user}
      />
    </>
  );
}

export default TopAndNavBar;
