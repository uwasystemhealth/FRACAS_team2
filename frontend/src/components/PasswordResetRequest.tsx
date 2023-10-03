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

enum STATE {
  INACTIVE,
  REQUEST_SENT,
  EMAIL_SENT,
}

const SignUpForm = () => {
  const [error, setError] = useState(false);
  const [accEmail, setAccEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [requestSent, setRequestSent] = useState(STATE.INACTIVE);

  const handleAccEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccEmail(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    if (accEmail.trim() == "") {
      setError(true);
      return;
    }
    if (requestSent === STATE.INACTIVE) {
      setRequestSent(STATE.REQUEST_SENT);
      try {
        await API_CLIENT.post<
          API_TYPES.AUTHENTICATION.SIGNUP.REQUEST,
          AxiosResponse<API_TYPES.AUTHENTICATION.SIGNUP.RESPONSE>
        >(API_ENDPOINT.AUTHENTICATION.PASSWORD_RESET_REQUEST, {
          email: accEmail,
        })
          .then((response) => {
            if (response) {
              const { err: err, msg: msg } = response.data;
              setRequestSent(STATE.EMAIL_SENT);
            } else {
              setRequestSent(STATE.INACTIVE);
              setErrorMessage("An error occurred");
            }
          })
          .catch(
            (error: AxiosError<API_TYPES.AUTHENTICATION.SIGNUP.RESPONSE>) => {
              if (error.response) {
                const { err: err, msg: msg } = error.response.data;
                setRequestSent(STATE.INACTIVE);
                setErrorMessage(`An error occurred. Error code ${err} ${msg}`);
              } else {
                setRequestSent(STATE.INACTIVE);
                setErrorMessage("An error occurred");
              }
            }
          );

        // Do something with the token (e.g., store it)
      } catch (error: any) {
        setRequestSent(STATE.INACTIVE);
      }
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
        Request password reset
      </Typography>
      <Typography maxWidth={700}>
        {requestSent !== STATE.EMAIL_SENT
          ? "Enter your account email address and a reset link will be sent to your email."
          : "Check your inbox for a reset link."}
      </Typography>
      {requestSent !== STATE.EMAIL_SENT && (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            value={accEmail}
            onChange={handleAccEmailChange}
            margin="normal"
            required
            fullWidth
            name="email"
            label="Account email address"
            type="email"
            id="email"
            autoFocus
            error={error}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            color={requestSent === STATE.INACTIVE ? "primary" : "inherit"}
          >
            {requestSent === STATE.INACTIVE ? "Request reset" : "Request sent"}
          </Button>
          <Typography color="error">{errorMessage}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default SignUpForm;
