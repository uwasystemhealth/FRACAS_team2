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
import LogoSVG from "@/public/UWAM Logo 2023 (colour).svg";
import Image from "next/image";
import axios, { AxiosError, AxiosResponse } from "axios";
import { API_CLIENT, API_ENDPOINT, API_TYPES } from "@/helpers/api";
import { useRouter } from "next/navigation";

interface Props {
  title: string | Element;
  description: string | Element;
  endpoint: string;
  url_params: string;
}

const SignUpForm = ({ title, description, endpoint, url_params }: Props) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(password !== confirmPassword);
    if (password === confirmPassword) {
      const token = new URLSearchParams(window.location.search).get("token");
      try {
        await API_CLIENT.post<
          API_TYPES.AUTHENTICATION.SIGNUP.REQUEST,
          AxiosResponse<API_TYPES.AUTHENTICATION.SIGNUP.RESPONSE>
        >(endpoint, {
          token: token,
          password: password,
        })
          .then((response) => {
            if (response) {
              const { err: err, msg: msg } = response.data;
              console.log("User registered.");

              router.push(`/login?${url_params}`);
            } else {
              setErrorMessage("An error occurred");
            }
          })
          .catch(
            (error: AxiosError<API_TYPES.AUTHENTICATION.SIGNUP.RESPONSE>) => {
              if (error.response) {
                const { err: err, msg: msg } = error.response.data;
                setErrorMessage(`An error occurred. Error code ${err} ${msg}`);
              } else {
                setErrorMessage("An error occurred");
              }
            }
          );

        // Do something with the token (e.g., store it)
      } catch (error: any) {}
    }
  };

  return (
    <Paper
      elevation={3}
      style={{
        margin: 20,
        padding: 20,
        maxWidth: "75vw",
        alignItems: "center",
      }}
    >
      <Image
        src={LogoSVG}
        alt="Logo"
        width={446}
        height={91.6833}
        layout="responsive"
      />
      <Typography variant="h4" textAlign="center">
        {title}
      </Typography>
      <Typography maxWidth={700}>{description}</Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
          helperText={
            error && (
              <Typography color="error">{"Passwords don't match."}</Typography>
            )
          }
          error={error}
          autoFocus
        />
        <TextField
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          margin="normal"
          required
          fullWidth
          id="confirm-password"
          label="Confirm Password"
          name="confirm-password"
          type="password"
          helperText={
            error && (
              <Typography color="error">{"Passwords don't match."}</Typography>
            )
          }
          error={error}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Typography color="error">{errorMessage}</Typography>
      </Box>
    </Paper>
  );
};

export default SignUpForm;
