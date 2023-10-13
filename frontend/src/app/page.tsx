"use client"
import CheckLogin, { PAGE_TYPE } from "@/components/CheckLogin";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/system/Box";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return <Box
    top={0}
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh">
      <ThemeRegistry>
      <CheckLogin pageType={PAGE_TYPE.EXTERNAL} />
      <CircularProgress />
      </ThemeRegistry>
      </Box>
  }