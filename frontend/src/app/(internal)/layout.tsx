'use client'
import * as React from 'react';
import { redirect, useRouter } from 'next/navigation'
import { API_CLIENT, API_ENDPOINT, TOKEN } from "@/helpers/api";
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Link from 'next/link';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import CreateIcon from '@mui/icons-material/Create';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListIcon from '@mui/icons-material/List';
import ArticleIcon from '@mui/icons-material/Article';
import { BACKEND_URL } from '@/helpers/constants';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const LINKS = [
  { text: 'Dashboard', href: '/', icon: HomeIcon },
  { text: 'Create Report', href: '/createreport', icon: CreateIcon },
  { text: 'Report List', href: '/record-list', icon: ListIcon },
  { text: 'View Report', href: '/viewreport', icon: ArticleIcon },
];

const PLACEHOLDER_LINKS = [
  { text: 'Admin', href: '/admin-dash', icon: SettingsIcon },
  //{ text: 'Logout', href: '/access', icon: LogoutIcon },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const logout = async () => {
    // delete refresh_token
    const refresh_token = localStorage.getItem(TOKEN.REFRESH);
    if (refresh_token) {
      await axios
        .delete(`${BACKEND_URL}${API_ENDPOINT.AUTHENTICATION.LOGOUT}`, {
          headers: {
            Authorization: `Bearer ${refresh_token}`,
          },
        })
        .then(() => {
          localStorage.removeItem(TOKEN.REFRESH);
        })
        .catch((error: AxiosError) => {
          if (error.response?.status !== 401) {
            throw error;
          }
        });
    }
  
    // delete access_token
    const access_token = localStorage.getItem(TOKEN.ACCESS);
    if (access_token) {
      await API_CLIENT.delete(API_ENDPOINT.AUTHENTICATION.LOGOUT)
        .then((response) => {
          localStorage.removeItem(TOKEN.ACCESS);
          //setMessage("Logged out!");
          router.push("/login");
        })
        .catch((error) => {
          if (error.response?.status !== 401) {
            //setMessage("Logout Error: " + error.response.data.msg);
            throw error;
          }
        });
    } else {
      router.push("/login");
    }
  };
  
  const token = localStorage.getItem(TOKEN.ACCESS); // Retrieve token from local storage

  if (!token) {
    redirect("/login"); // Redirect to login page if not authenticated
  }
  
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <html lang="en">
      <body>
      <Box sx={{ display: 'flex' }}>
        <ThemeRegistry>
          <AppBar position="fixed" open={open}>
            <Toolbar sx={{ backgroundColor: 'background.paper' }}>
              <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
              <Typography variant="h6" noWrap component="div" color="black">
                UWAM FRACAS
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {LINKS.map(({ text, href, icon: Icon }) => (
                <ListItem key={href} disablePadding>
                  <ListItemButton component={Link} href={href}>
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ mt: 'auto' }} />
            <List>
              {PLACEHOLDER_LINKS.map(({ text, href, icon: Icon }) => (
                <ListItem key={href} disablePadding>
                  <ListItemButton component={Link} href={href}>
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding>
                  <ListItemButton onClick={logout}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              flexGrow: 1, 
              p: 3,
              bgcolor: 'background.default',
            }}
          >
            <DrawerHeader />
            {children}
          </Box>
        </ThemeRegistry>
      </Box>
      </body>
    </html>
  );
}
