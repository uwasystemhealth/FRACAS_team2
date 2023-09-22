"use client";

/*
 * Better FRACAS
 * Copyright (C) 2023  Insan Basrewan, Peter Tanner, ??? Better Fracas team
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from "react";
import { redirect, useRouter } from "next/navigation";
import { API_CLIENT, API_ENDPOINT, API_TYPES, TOKEN } from "@/helpers/api";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Link from "next/link";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import CreateIcon from "@mui/icons-material/Create";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListIcon from "@mui/icons-material/List";
import ArticleIcon from "@mui/icons-material/Article";
import { BACKEND_URL } from "@/helpers/constants";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import CheckLogin, { PAGE_TYPE } from "@/components/CheckLogin";
import LogoSVG from "@/public/UWAM Logo 2023 (colour).svg";
import { borderRight } from "@mui/system";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const TOP_LINKS = [
  { text: "Dashboard", href: "/", icon: HomeIcon, superuserOnly: false },
  {
    text: "Create Report",
    href: "/createreport",
    icon: CreateIcon,
    superuserOnly: false,
  },
  {
    text: "Report List",
    href: "/record-list",
    icon: ListIcon,
    superuserOnly: false,
  },
];

const BOTTOM_LINKS = [
  {
    text: "Admin",
    href: "/admin-dash",
    icon: SettingsIcon,
    superuserOnly: true,
  },
  //{ text: 'Logout', href: '/access', icon: LogoutIcon, superuserOnly: false },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await API_CLIENT.get<API_TYPES.AUTHENTICATION.TEST_LOGGED_IN.RESPONSE>(
          API_ENDPOINT.AUTHENTICATION.TEST_LOGGED_IN
        )
          .then((response) => {
            setIsSuperuser(response.data.superuser);
          })
          .catch(
            (
              error: AxiosError<API_TYPES.AUTHENTICATION.TEST_LOGGED_IN.RESPONSE>
            ) => {
              router.push("/login");
            }
          );
      } catch (error) {
        router.push("/login");
      }
    })();
  }, []);

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
      <CheckLogin pageType={PAGE_TYPE.INTERNAL} />
      <body>
        <Box sx={{ display: "flex" }}>
          <ThemeRegistry>
            <AppBar position="fixed" open={open}>
              <Toolbar sx={{ backgroundColor: "background.paper" }}>
                <IconButton
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{
                    marginRight: 5,
                    ...(open && { display: "none" }),
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" color="white">
                  UWAM FRACAS
                </Typography>
                <Image
                src={LogoSVG}
                alt="Logo"
                width={130}
                height={65}
                style={{display:"flex", marginLeft:"15px"}}
                />
              </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
              <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </IconButton>
              </DrawerHeader>
              <Divider />
              <List>
                {TOP_LINKS.map(
                  ({ text, href, icon: Icon, superuserOnly }) =>
                    (!superuserOnly || isSuperuser) && (
                      <ListItem key={href} disablePadding>
                        <ListItemButton component={Link} href={href}>
                          <ListItemIcon>
                            <Icon />
                          </ListItemIcon>
                          <ListItemText primary={text} />
                        </ListItemButton>
                      </ListItem>
                    )
                )}
              </List>
              <Divider sx={{ mt: "auto" }} />
              <List>
                {BOTTOM_LINKS.map(
                  ({ text, href, icon: Icon, superuserOnly }) =>
                    (!superuserOnly || isSuperuser) && (
                      <ListItem key={href} disablePadding>
                        <ListItemButton component={Link} href={href}>
                          <ListItemIcon>
                            <Icon />
                          </ListItemIcon>
                          <ListItemText primary={text} />
                        </ListItemButton>
                      </ListItem>
                    )
                )}
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
                bgcolor: "background.default",
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
