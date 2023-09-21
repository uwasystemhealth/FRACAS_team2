"use client";

/*
 * Better FRACAS
 * Copyright (C) 2023  Peter Tanner
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

import { Box, Button, Paper, Typography } from "@mui/material";
import react, { useState, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios"; // Import Axios
import withAuth from "@/helpers/authWrapper";
import { API_CLIENT, API_ENDPOINT, API_TYPES, TOKEN } from "@/helpers/api";
import { useRouter } from "next/navigation";

const Home = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();

  // redirect to access page if user is already logged in.
  useEffect(() => {
    (async () => {
      try {
        await API_CLIENT.get<API_TYPES.AUTHENTICATION.TEST_LOGGED_IN.RESPONSE>(
          API_ENDPOINT.AUTHENTICATION.TEST_LOGGED_IN
        )
          .then((response) => {
            setMessage(`${response.data.msg}, identity=${response.data.email}`);
          })
          .catch(
            (
              error: AxiosError<API_TYPES.AUTHENTICATION.TEST_LOGGED_IN.RESPONSE>
            ) => {
              if (error.response) {
                setMessage(
                  "Redirecting to login in 3 seconds... Error: " +
                    error.response.data.msg
                );
              } else {
                setMessage("Redirecting to login in 3 seconds... Error: ?");
              }
              setTimeout(() => {
                router.push("/login");
              }, 5000);
            }
          );
      } catch (error) {
        setMessage("Unknown error.");
      }
    })();
  }, []);

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
          setMessage("Logged out!");
          router.push("/login");
        })
        .catch((error) => {
          if (error.response?.status !== 401) {
            setMessage("Logout Error: " + error.response.data.msg);
            throw error;
          }
        });
    } else {
      router.push("/login");
    }
  };

  return (
    <Box
      top={0}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper
        elevation={3}
        style={{ margin: 20, padding: 20, maxWidth: "75vw" }}
      >
        <Typography>{message}</Typography>
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={logout}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
};

Home.getInitialProps = async () => {};

export default Home;
