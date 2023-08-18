"use client";

import React from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Checkbox,
  Link,
  Typography,
  FormControlLabel,
} from "@mui/material";
import LogoSVG from "../public/UWAM Logo 2023 (colour).svg";
import Image from "next/image";

const LoginPage: React.FC = () => {
  return (
    <Box
      top={0}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper elevation={3} style={{ padding: 20, minWidth: 300 }}>
        <Image
          src="/UWAM Logo 2023 (colour).svg"
          alt="Logo"
          width={446}
          height={91.6833}
          layout="responsive"
        />
        <TextField
          tabIndex={1}
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          tabIndex={2}
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <FormControlLabel
            tabIndex={3}
            control={<Checkbox color="primary" />}
            label="Remember me"
          />

          <Link href="#" color="primary" tabIndex={5}>
            <Typography>Forgot password?</Typography>
          </Link>
        </Box>
        <Button
          type="submit"
          tabIndex={4}
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
