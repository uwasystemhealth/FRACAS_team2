"use client";

import React, { Fragment, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Checkbox,
  Link,
  Typography,
  FormControlLabel,
  Grid,
} from "@mui/material";
import LogoSVG from "../public/UWAM Logo 2023 (colour).svg";
import Image from "next/image";
import axios, { AxiosError, AxiosResponse } from "axios";
import { API_CLIENT, API_ENDPOINT } from "@/helpers/api";
import { useRouter } from "next/navigation";

interface AuthenticationLoginSend {
  email: string;
  password: string;
}

interface AuthenticationLoginResponse {
  access_token: string;
  refresh_token: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await API_CLIENT.post<
        AuthenticationLoginSend,
        AuthenticationLoginResponse
      >(API_ENDPOINT.AUTHENTICATION.LOGIN, {
        email: email,
        password: password,
      })
        .then((response) => {
          if (response) {
            const { access_token: accessToken, refresh_token: refreshToken } =
              response;
            localStorage.setItem("access-token", accessToken);
            localStorage.setItem("refresh-token", refreshToken);
            console.log("LOGIN SUCCESSFUL!");

            router.push("/");
          } else {
            setErrorMessage("An error occurred");
          }
        })
        .catch((error: AxiosError) => {
          console.log({ email: email, password: password });
          if (error.response) {
            if (error.status === 401) setErrorMessage("Bad email or password");
            else
              setErrorMessage(
                `An error occurred. Error code ${error.code} ${error.message}`
              );
          } else {
            setErrorMessage("An error occurred");
          }
        });

      // Do something with the token (e.g., store it)
    } catch (error: any) {}
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
        <Image
          src={LogoSVG}
          alt="Logo"
          width={446}
          height={91.6833}
          layout="responsive"
        />
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            value={email}
            onChange={handleEmailChange}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          {errorMessage && (
            <Typography color="error">{errorMessage}</Typography>
          )}
          <Grid container justifyContent="flex-end">
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item xs>
              <Link href="#" variant="body2">
                <Typography textAlign={"right"}>
                  {"Don't have an account? Sign Up"}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
