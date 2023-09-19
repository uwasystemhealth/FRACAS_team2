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
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import { date } from "yup";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 60 },
  { field: "date", headerName: "Creation Date", width: 170 },
  { field: "ReportName", headerName: "Report name", width: 350 },
  { field: "carYear", headerName: "Car year", width: 100 },
  { field: "creatorName", headerName: "Creator name", width: 130 },
  { field: "status", headerName: "Status", width: 100 },
];

const rows = [
  {
    id: 1,
    date: "27/08/2023",
    ReportName: "Report 1",
    carYear: 2023,
    creatorName: "Jon",
    status: "Open",
  },
  {
    id: 2,
    date: "27/08/2023",
    ReportName: "Report 2",
    carYear: 2023,
    creatorName: "Kyle",
    status: "Open",
  },
  {
    id: 3,
    date: "27/08/2023",
    ReportName: "Report 3",
    carYear: 2022,
    creatorName: "Kyle",
    status: "Open",
  },
  {
    id: 4,
    date: "27/08/2023",
    ReportName: "Report 4",
    carYear: 2023,
    creatorName: "Lan",
    status: "Open",
  },
  {
    id: 5,
    date: "27/08/2023",
    ReportName: "Report 5",
    carYear: 2022,
    creatorName: "Steve",
    status: "Open",
  },
  {
    id: 6,
    date: "27/08/2023",
    ReportName: "Report 6",
    carYear: 2021,
    creatorName: "Jan",
    status: "Open",
  },
  {
    id: 7,
    date: "27/08/2023",
    ReportName: "Report 7",
    carYear: 2023,
    creatorName: "Red",
    status: "Open",
  },
  {
    id: 8,
    date: "27/08/2023",
    ReportName: "Report 8",
    carYear: 2023,
    creatorName: "James",
    status: "Open",
  },
  {
    id: 9,
    date: "27/08/2023",
    ReportName: "Report 9",
    carYear: 2023,
    creatorName: "Mary",
    status: "Open",
  },
];

export default function DataTable() {
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
    <Card style={{padding:10}}>
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
