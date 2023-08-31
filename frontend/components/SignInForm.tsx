"use client";

import React, { Fragment, useEffect, useState } from "react";
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
  Alert,
  AlertTitle,
} from "@mui/material";
import LogoSVG from "../public/UWAM Logo 2023 (colour).svg";
import Image from "next/image";
import axios, { AxiosError, AxiosResponse } from "axios";
import { API_CLIENT, API_ENDPOINT, TOKEN, API_TYPES } from "@/helpers/api";
import { useRouter } from "next/navigation";

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // redirect user if they are already signed in. if the token is invalid,
    // they will be redirected back here by the access page.
    if (localStorage.getItem(TOKEN.ACCESS)) router.push("/access");
    const param = new URLSearchParams(window.location.search).get("new_user");
    setNewUser(param !== null && param?.trim() !== "0" && param?.trim() !== "");
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(false);
    setEmailError(false);
    setErrorMessage("");
    if (email && password) {
      try {
        const response = await API_CLIENT.post<
          API_TYPES.AUTHENTICATION.LOGIN.REQUEST,
          AxiosResponse<API_TYPES.AUTHENTICATION.LOGIN.RESPONSE>
        >(API_ENDPOINT.AUTHENTICATION.LOGIN, {
          email: email,
          password: password,
        })
          .then((response) => {
            if (response) {
              const { access_token: accessToken, refresh_token: refreshToken } =
                response.data;
              localStorage.setItem(TOKEN.ACCESS, accessToken);
              localStorage.setItem(TOKEN.REFRESH, refreshToken);

              // TODO: does this wokr?
              API_CLIENT.defaults.headers[
                "Authorization"
              ] = `Bearer ${accessToken}`;
              API_CLIENT.defaults.headers["X-Refresh-Token"] = refreshToken;

              router.push("/access");
            } else {
              setErrorMessage("An error occurred");
            }
          })
          .catch((error: AxiosError) => {
            if (error.response) {
              if (error.response.status === 401)
                setErrorMessage("Bad email or password");
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
    } else {
      email && setPasswordError(true);
      password && setEmailError(true);
    }
  };

  return (
    <Paper elevation={3} style={{ margin: 20, padding: 20, maxWidth: "75vw" }}>
      <Image
        src={LogoSVG}
        alt="Logo"
        width={446}
        height={91.6833}
        layout="responsive"
      />
      <Typography variant="h1" textAlign="center">
        Sign in
      </Typography>
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
          error={emailError}
          helperText={emailError && "Email is required."}
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
          error={passwordError}
          helperText={passwordError && "Password is required."}
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
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <Grid container>
          {newUser && (
            <Alert style={{ width: "100%" }} severity="success">
              <AlertTitle>Registration successful!</AlertTitle>
              Please login with your credentials.
            </Alert>
          )}
          {/* <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid> */}
          {/* <Grid item xs>
            <Link href="#" variant="body2">
              <Typography textAlign={"right"}>
                {"Don't have an account? Sign Up"}
              </Typography>
            </Link>
          </Grid> */}
        </Grid>
      </Box>
    </Paper>
  );
};

export default SignInForm;
