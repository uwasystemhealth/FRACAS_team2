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
import axios from "axios";
import { BACKEND_URL } from "@/components/Constants";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios
        .post(`${BACKEND_URL}/api/v1/authentication/login`, {
          email,
          password,
        })
        .catch((error) => {
          console.log("LOGIN ERROR :(");
          console.log(error);
          if (error.response) {
            if (error.response.status === 401)
              setErrorMessage("Bad username or password");
            else
              setErrorMessage(
                `An error occurred. Error code ${error.response.status}`
              );
          } else {
            setErrorMessage("An error occurred");
          }
        });

      // Assuming the response contains a token
      const token = response.data.token;
      console.log("LOGIN SUCCESSFUL!");

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
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
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
