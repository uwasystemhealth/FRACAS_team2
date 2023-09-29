"use client";

/*
 * Better FRACAS
 * Copyright (C) 2023  ??? Better Fracas team
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

import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import { darkTheme, lightTheme } from "./theme";
import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import ReactToPrint from "react-to-print";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [lightMode, setLightMode] = useState(
    useMediaQuery("(prefers-color-scheme: light)")
  );

  const checkTerribleMode = () => {
    if (typeof window === "object") {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      return (params.get("light") || "0") === "1";
    }
    return false;
  };

  useEffect(() => {
    setLightMode(isPrinting || checkTerribleMode());
  }, [isPrinting, checkTerribleMode()]);

  useEffect(() => {
    console.log(isPrinting, lightMode);
  }, [isPrinting, lightMode]);

  return (
    <>
      <ReactToPrint
        onBeforeGetContent={() => setIsPrinting(true)}
        onBeforePrint={() => setIsPrinting(true)}
        onAfterPrint={() => setIsPrinting(false)}
        content={() => null}
      />
      <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
        <ThemeProvider theme={lightMode ? lightTheme : darkTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </>
  );
}
