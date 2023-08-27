"use client";

import { Box, Button, Paper, Typography } from "@mui/material";
import react, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios"; // Import Axios
import withAuth from "@/helpers/authWrapper";
import { API_CLIENT, API_ENDPOINT, TOKEN } from "@/helpers/api";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/helpers/constants";

const Home = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();

  // test connection
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API_CLIENT.get(
          "/api/v1/authentication/test_logged_in"
        )
          .then((response) => {
            setMessage(response.data.msg);
          })
          .catch((error) => {
            setMessage("Error: " + error.response.data.msg);
          });
      } catch (error) {
        setMessage("Unknown error.");
      }
    };

    fetchData();
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

export default Home;
