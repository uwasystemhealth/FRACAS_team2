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
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
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
import ListIcon from "@mui/icons-material/List";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import CheckLogin, { PAGE_TYPE } from "@/components/CheckLogin";
import LogoSVG from "@/public/UWAM Logo 2023 (colour).svg";
import Grid from "@mui/material/Unstable_Grid2"
import { usePathname } from 'next/navigation';

interface CurrentUser {
  name: string;
  id: string;
  team_id: number;
  superuser: boolean;
}

const drawerWidth = 220;

const TOP_LINKS = [
  { text: "Dashboard", href: "/dashboard", icon: HomeIcon, superuserOnly: false },
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

export default function RootLayout({children}: {children: React.ReactNode;}) 
{
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<CurrentUser>();
  const [isSuperuser, setSuperuser] = useState(false);
  const [name, setName] = useState("");

  const fetchCurrentUser = async () => {
    API_CLIENT.get(API_ENDPOINT.AUTHENTICATION.TEST_LOGGED_IN)
      .then((response) => {
        if (response.status == 200) {
          setCurrentUser(response.data);
          setSuperuser(response.data.superuser)
          setName(response.data.name);
        } else {
          router.push("/login");
          console.error(response.statusText)
        }
      })
      .catch(
        (
          error: AxiosError<API_TYPES.AUTHENTICATION.TEST_LOGGED_IN.RESPONSE>
        ) => {
          router.push("/login");
        }
      );
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const HeaderTitle = () => {
    let title = usePathname()
    if (title === "/dashboard") {
      return "Welcome " + name;
    }
    else if (title === "/createreport") {
      return "Create Report";
    }
    else if (title === "/record-list") {
      return "Report Database";
    }
    else if (title.startsWith("/editreport")) {
      return "Edit Report";
    }
    else if (title.startsWith("/viewreport")) {
      return "Report";
    }
    else if (title === "/admin-dash") {
      return "Admin Page";
    }

  }

  const logout = async () => {
    // delete refresh_token
    const refresh_token = localStorage.getItem(TOKEN.REFRESH);
    if (refresh_token) {
      await axios
        .delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_ENDPOINT.AUTHENTICATION.LOGOUT}`,
          {
            headers: {
              Authorization: `Bearer ${refresh_token}`,
            },
          }
        )
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

  const toggleDrawer = () => {
      setOpen(!open);
  };

  const drawer = (
        <div>
          <Grid container spacing={2}>
            <Grid xs={12}>
            <Link href="/dashboard">
            <Image
              src={LogoSVG}
              alt="Logo"
              width={200}
              style={{ display: "flex", margin: "10px" }}
            />
            </Link>
            <Divider />
            <List>
            {TOP_LINKS.map(
              ({ text, href, icon: Icon, superuserOnly }) =>
              // @ts-ignore
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
              // @ts-ignore
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
            </Grid>
          </Grid>
          <Divider />
        </div>
  );

  return (
    <Box sx={{ display: "flex"}}>
      <ThemeRegistry>
        <AppBar position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          displayPrint: "none"
        }}>
          <Toolbar
            sx={{
              backgroundColor: "background.paper",
              displayPrint: "none",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" color="white">
              {HeaderTitle()}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, displayPrint: "none" }}
      >
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            displayPrint: "none",
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="temporary"
          onClose={toggleDrawer}
          open={open}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            displayPrint: "none",
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            bgcolor: "background.default", 
            flexGrow: 1, p: { xs: 2, sm: 3 }, width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
          {children}
        </Box>
      </ThemeRegistry>
    </Box>
  );
}
