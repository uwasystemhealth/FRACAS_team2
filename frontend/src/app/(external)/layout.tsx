import { Box } from "@mui/material";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ margin: 0 }}>
      <body style={{ margin: 0 }}>
        <Box
          top={0}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          {children}
        </Box>
      </body>
    </html>
  );
}
