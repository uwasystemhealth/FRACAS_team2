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
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { boolean, date } from "yup";
import { useEffect, useState } from "react";
import { API_CLIENT, API_ENDPOINT, API_TYPES } from "@/helpers/api";
import { AxiosError, AxiosResponse } from "axios";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "title", headerName: "Report name", flex: 1 },
  { field: "created_at", headerName: "Creation Date", flex: 1 },
  { field: "car_year", headerName: "Car year", flex: 1 },
  {
    field: "creator.name",
    headerName: "Creator name",
    flex: 1,
    valueGetter: (params) => params.row?.creator?.email,
  },
  {
    field: "edit",
    headerName: "Edit",
    width: 100,
    renderCell: (params) => (
      <IconButton
        color="primary"
        aria-label="Edit"
        href={`/editreport/${params.row.id}`}
      >
        <EditIcon />
      </IconButton>
    ),
  },
  {
    field: "view",
    headerName: "View",
    width: 100,
    renderCell: (params) => (
      <IconButton
        color="primary"
        aria-label="View"
        href={`/viewreport/${params.row.id}`}
      >
        <VisibilityIcon />
      </IconButton>
    ),
  },
];

export default function DataTable() {
  const [rows, setRows] = useState<API_TYPES.REPORT.GET.RESPONSE[]>([]);

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
    <Card
      style={{
        padding: 10,
        maxWidth: "100%",
        margin: "0 auto",
      }}
    >
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
    </Card>
  );
}
