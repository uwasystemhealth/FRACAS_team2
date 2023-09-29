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
import LogoSVG from "@/public/UWAM Logo 2023 (colour).svg";
import Image from "next/image";
import axios, { AxiosError, AxiosResponse } from "axios";
import { API_CLIENT, API_ENDPOINT, TOKEN, API_TYPES } from "@/helpers/api";
import { useRouter } from "next/navigation";
import CheckLogin, { PAGE_TYPE } from "./CheckLogin";

enum MESSAGE_TYPE {
  NONE,
  NEW_USER,
  RESET_PASSWORD,
}

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [newUser, setNewUser] = useState(MESSAGE_TYPE.NONE);
  const router = useRouter();

  const get_boolean = (param: string | null) =>
    param !== null && param?.trim() !== "0" && param?.trim() !== "";

  useEffect(() => {
    const new_user = new URLSearchParams(window.location.search).get(
      "new_user"
    );
    const reset_pwd = new URLSearchParams(window.location.search).get(
      "reset_pwd"
    );
    if (get_boolean(new_user)) setNewUser(MESSAGE_TYPE.NEW_USER);
    else if (get_boolean(reset_pwd)) setNewUser(MESSAGE_TYPE.RESET_PASSWORD);
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

              API_CLIENT.defaults.headers[
                "Authorization"
              ] = `Bearer ${accessToken}`;
              API_CLIENT.defaults.headers["X-Refresh-Token"] = refreshToken;

              router.push("/");
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
      <CheckLogin pageType={PAGE_TYPE.EXTERNAL} />
      <Image
        src={LogoSVG}
        alt="Logo"
        width={446}
        height={91.6833}
        layout="responsive"
      />
      <Typography variant="h4" textAlign="center">
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
        <Link href="/password-reset-request">
          <Typography>Forgot password?</Typography>
        </Link>
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
          {newUser === MESSAGE_TYPE.NEW_USER && (
            <Alert style={{ width: "100%" }} severity="success">
              <AlertTitle>Registration successful!</AlertTitle>
              Please login with your credentials.
            </Alert>
          )}
          {newUser === MESSAGE_TYPE.RESET_PASSWORD && (
            <Alert style={{ width: "100%" }} severity="success">
              <AlertTitle>Password reset successful!</AlertTitle>
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
