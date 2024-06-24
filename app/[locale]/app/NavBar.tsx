'use client';

import Text from '@/components/Text';
import {useScopedI18n} from '@/locales/client';
import {AuthedUser} from '@/utils/server/authUserId';
import {Group, Input, Menu, MenuOpen, Person, Quiz} from '@mui/icons-material';
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  SvgIconTypeMap,
  Theme,
  Toolbar,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import {OverridableComponent} from '@mui/material/OverridableComponent';
import Link from 'next/link';
import {useCallback, useEffect, useMemo, useState} from 'react';
import NavItem from './NavItem';
import {usePathname} from 'next/navigation';
import Version from '@/utils/Version';

type NavBarProps = {
  isMobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  user: AuthedUser;
};

interface OpenState {
  title: string;
  open: boolean;
}

interface MenuItem {
  href?: string;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>> & {
    muiName: string;
  };
  title: string;
  notifications?: number;
  nestedList?: MenuItem[];
  id?: string;
}

function NavBar({isMobileNavOpen, setMobileNavOpen, user}: NavBarProps) {
  const pathname = usePathname();
  const t = useScopedI18n('common');
  const lgUp = useMediaQuery<Theme>(theme => theme.breakpoints.up('lg'));
  const [minimized, setMinimized] = useState(
    typeof window !== 'undefined' &&
      localStorage.getItem('menu:minimized') === 'true'
  );
  const [open, setOpen] = useState<OpenState[]>([]);
  const [selected, setSelected] = useState('');

  const items: MenuItem[] = useMemo(
    () =>
      [
        user.admin
          ? {
              href: '/app/admin/user/list',
              icon: Group,
              title: t('userList'),
            }
          : null,
        {
          icon: Quiz,
          title: t('examples'),
          nestedList: [
            {
              href: '/app/todo',
              icon: Quiz,
              title: 'TODO 1',
            },
            {
              href: '/app/todo',
              icon: Quiz,
              title: 'TODO 2',
            },
            {
              href: '/app/todo',
              icon: Quiz,
              title: 'TODO 3',
            },
            {
              href: '/app/todo',
              icon: Quiz,
              title: 'TODO 4',
            },
          ],
        },
      ].filter(Boolean) as MenuItem[],
    [t, user.admin]
  );

  /**
   * Enlarge/Retract the menu
   */
  const handleMenuResize = useCallback(() => {
    // Store preference locally
    localStorage.setItem('menu:minimized', minimized ? 'false' : 'true');

    setMinimized(!minimized);
  }, [minimized]);

  const handleOpen = useCallback(
    (title: string) => () => {
      const tempOpen = open.map(item => {
        if (item.title === title) {
          return {
            title,
            open: !item.open,
          };
        }
        return item;
      });
      setOpen(tempOpen);
      setSelected(title);
    },
    [open]
  );

  // Close mobile nav on route change
  useEffect(() => {
    if (!isMobileNavOpen) {
      setMobileNavOpen(false);
    }
  }, [pathname, isMobileNavOpen, setMobileNavOpen]);

  // Pre open nested lists depending on the current path + set selected item
  useEffect(() => {
    const path = pathname;
    setOpen(prev =>
      items.reduce<OpenState[]>((acc, curr) => {
        const id = curr.id || curr.title;
        let foundNested = false;

        if (curr.nestedList) {
          curr.nestedList.forEach(nestedItem => {
            const nestedId = nestedItem.id || nestedItem.title;
            let foundNestedNested = false;
            if (nestedItem.nestedList) {
              nestedItem.nestedList.forEach(nestedNestedItem => {
                if (nestedNestedItem.href && path === nestedNestedItem.href) {
                  foundNestedNested = true;
                  acc.push({
                    title: nestedId,
                    open: true,
                  });
                  setSelected(nestedNestedItem.id || nestedNestedItem.title);
                }
              });

              if (!foundNestedNested) {
                acc.push({
                  title: nestedId,
                  open: (prev.find(p => p.title === nestedId) || {open: false})
                    .open,
                });
              }
            } else if (nestedItem.href && path === nestedItem.href) {
              setSelected(nestedId);
            }

            if (
              (nestedItem.href && path === nestedItem.href) ||
              foundNestedNested
            ) {
              foundNested = true;
              acc.push({
                title: id,
                open: true,
              });
              if (!foundNestedNested) {
                setSelected(nestedId);
              }
            }
          });

          if (!foundNested) {
            acc.push({
              title: id,
              open: (prev.find(p => p.title === id) || {open: false}).open,
            });
          }
        } else if (curr.href && curr.href === path) {
          setSelected(id);
        }

        return acc;
      }, [])
    );
  }, [items, pathname]);

  const content = (
    <Box display="flex" flexDirection="column" height="100%">
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        sx={{
          minHeight: 8 * 6,
        }}
      >
        {(!minimized || isMobileNavOpen) && (
          <Text color="textPrimary" h5>
            {user.person.firstName} {user.person.lastName}
          </Text>
        )}
      </Box>
      <Divider />

      {!lgUp && (
        <>
          <Toolbar>
            <Link href={`/app/user/${user.id}/edit`}>
              <IconButton size="large">
                <Tooltip title="Account">
                  <Person />
                </Tooltip>
              </IconButton>
            </Link>
            <IconButton color="inherit" size="large">
              <Tooltip title="Logout">
                <Input />
              </Tooltip>
            </IconButton>
          </Toolbar>
          <Divider />
        </>
      )}

      <Box sx={{p: 0}}>
        <List sx={{width: 1, pt: 0}}>
          {items.map(
            item =>
              item && (
                <Box key={item.title}>
                  <NavItem
                    href={item.href}
                    icon={item.icon}
                    minimized={minimized && !isMobileNavOpen}
                    notifications={item.notifications}
                    onClick={handleOpen(item.id || item.title)}
                    selected={selected === (item.id || item.title)}
                    title={minimized && !isMobileNavOpen ? '' : item.title}
                    hasChildren={!!item.nestedList}
                  />
                  {item.nestedList ? (
                    <Collapse
                      in={
                        (
                          open.find(
                            nestedList =>
                              nestedList.title === (item.id || item.title)
                          ) || {open: false}
                        ).open
                      }
                      timeout="auto"
                      unmountOnExit
                    >
                      <List
                        component="div"
                        disablePadding
                        sx={{pl: minimized ? 2 : 3}}
                      >
                        {item.nestedList.map(nestedItem => (
                          <Box key={nestedItem.title}>
                            <NavItem
                              href={nestedItem.href}
                              icon={nestedItem.icon}
                              key={nestedItem.title}
                              minimized={minimized && !isMobileNavOpen}
                              nestedItem
                              notifications={nestedItem.notifications}
                              onClick={handleOpen(
                                nestedItem.id || nestedItem.title
                              )}
                              selected={
                                selected === (nestedItem.id || nestedItem.title)
                              }
                              title={
                                minimized && !isMobileNavOpen
                                  ? ''
                                  : nestedItem.title
                              }
                              hasChildren={!!nestedItem.nestedList}
                            />
                            {nestedItem.nestedList ? (
                              <Collapse
                                in={
                                  (
                                    open.find(
                                      nestedList =>
                                        nestedList.title ===
                                        (nestedItem.id || nestedItem.title)
                                    ) || {open: false}
                                  ).open
                                }
                                timeout="auto"
                                unmountOnExit
                              >
                                <List
                                  component="div"
                                  disablePadding
                                  sx={{pl: minimized ? 1 : 3}}
                                >
                                  {nestedItem.nestedList.map(
                                    nestedNestedItem => (
                                      <NavItem
                                        href={nestedNestedItem.href}
                                        icon={nestedNestedItem.icon}
                                        key={nestedNestedItem.title}
                                        minimized={
                                          minimized && !isMobileNavOpen
                                        }
                                        selected={
                                          selected ===
                                          (nestedNestedItem.id ||
                                            nestedNestedItem.title)
                                        }
                                        nestedItem
                                        notifications={
                                          nestedNestedItem.notifications
                                        }
                                        title={
                                          minimized && !isMobileNavOpen
                                            ? ''
                                            : nestedNestedItem.title
                                        }
                                      />
                                    )
                                  )}
                                </List>
                              </Collapse>
                            ) : null}
                          </Box>
                        ))}
                      </List>
                    </Collapse>
                  ) : null}
                </Box>
              )
          )}
        </List>
      </Box>
      <Box flexGrow={1} />
      <Box bgcolor="background.dark" m={2} p={2}>
        {!minimized && !isMobileNavOpen && (
          <Text align="center" body2>
            PREVIEW - v{Version}
          </Text>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        anchor="left"
        onClose={() => setMobileNavOpen(false)}
        open={isMobileNavOpen}
        sx={{
          display: {xs: 'block', lg: 'none'},
          '& .MuiDrawer-paper': {
            width: 8 * 32,
            zIndex: 99,
          },
        }}
        variant="temporary"
      >
        {content}
      </Drawer>
      <Tooltip title={minimized ? t('maximize') : t('minimize')}>
        <IconButton
          onClick={handleMenuResize}
          size="large"
          sx={{
            display: {xs: 'block', lg: 'none'},
            position: 'absolute',
            top: 8 * 8,
            left: 8 * 1,
            zIndex: 1201,
          }}
        >
          {minimized ? <Menu /> : <MenuOpen />}
        </IconButton>
      </Tooltip>
      <Drawer
        anchor="left"
        open
        sx={{
          display: {xs: 'none', lg: 'block'},
          '& .MuiDrawer-paper': {
            width: 8 * 32,
            height: 'calc(100% - 64px)',
            position: 'relative',
            mt: 8,
            ...(minimized
              ? {
                  width: 8 * 8,
                  overflow: 'hidden',
                }
              : null),
          },
        }}
        variant="persistent"
      >
        {content}
      </Drawer>
    </>
  );
}

export default NavBar;
