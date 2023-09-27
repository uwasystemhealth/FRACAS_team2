"use client";
/*
 * Better FRACAS
 * Copyright (C) 2023  Peter Tanner, ??? Better Fracas team
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

import ReportList, { UserReport } from "@/components/ReportList";
import { API_TYPES, API_CLIENT, API_ENDPOINT } from "@/helpers/api";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";

const RecordList = () => {
  const [rows, setRows] = useState<UserReport[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const response = await API_CLIENT.get(API_ENDPOINT.RECORD)
          .then((response) => {
            if (response) {
              console.log(response.data);
              setRows(response.data);
            } else {
              console.error("An error occurred");
            }
          })
          .catch((error: AxiosError) => {
            console.error("An error occurred " + error.message);
          });

        // Do something with the token (e.g., store it)
      } catch (error: any) {}
    })();
  }, []);

  return <ReportList rows={rows} setRows={setRows} />;
};

export default RecordList;
