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

import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import { date } from "yup";
import { useEffect, useState } from "react";
import { API_CLIENT, API_ENDPOINT, API_TYPES } from "@/helpers/api";
import { AxiosError, AxiosResponse } from "axios";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 60 },
  { field: "created_at", headerName: "Creation Date", width: 170 },
  { field: "title", headerName: "Report name", width: 350 },
  { field: "car_year", headerName: "Car year", width: 100 },
  { field: "creator", headerName: "Creator name", width: 130 },
  { field: "status", headerName: "Status", width: 100 },
];

export default function DataTable() {
  const [rows, setRows] = useState<API_TYPES.REPORT.GET.RESPONSE[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await API_CLIENT.get<
          any,
          AxiosResponse<API_TYPES.REPORT.GET.RESPONSE[]>
        >(API_ENDPOINT.RECORD, {})
          .then((response) => {
            if (response) {
              console.log(response.data);
              const {
                title: title,
                created_at: created_at,
                id: id,
                car_year: car_year,
                creator: creator,
              } = response.data;
              setRows({
                title: title,
                created_at: created_at,
                id: id,
                car_year: car_year,
                creator: creator.email,
              });
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

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div style={{ height: 400, width: "100%" }}>
      <TextField
        label="Search"
        value={searchTerm}
        onChange={handleSearchChange}
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        pagination
        pageSizeOptions={[5, 25, 100]}
        checkboxSelection
      />
    </div>
  );
}
