"use client";

import { Box, Paper, Typography } from "@mui/material";
import react from "react";
import withAuth from "@/helpers/authWrapper";

const Home = () => {
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
        <Typography>BetterFRACAS entrypoint. Please login at /login</Typography>
      </Paper>
    </Box>
  );
};

export default withAuth(Home);
