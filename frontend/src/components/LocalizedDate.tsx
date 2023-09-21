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

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { DateTimeField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Typography } from "@mui/material";
import { get_client_tz } from "@/helpers/client_utils";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

interface Props {
  date_string: string;
}
const LocalizedDate = ({ date_string }: Props) => {
  return (
    <Typography>
      {dayjs
        .utc(date_string, "YYYY-MM-DD[T]HH:mm")
        .local()
        .format("YYYY-MM-DDTHH:mm:ss")}
    </Typography>
  );
};

export default LocalizedDate;
