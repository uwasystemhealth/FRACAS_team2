"use client";

import { createTheme } from "@mui/material";

const defaultTheme = createTheme({
  typography: {
    fontFamily: "Arial, sans-serif", // Set the desired font family
  },
  palette: {
    mode: 'dark',
  },
});

export default defaultTheme;