'use client'
import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width:30 },
  { field: 'date', headerName: 'Creation Date', width: 125 },
  { field: 'ReportName', headerName: 'Report name', width: 275 },
  { field: 'carYear', headerName: 'Car year', width: 100,},
  { field: 'creatorName', headerName: 'Creator name', width: 130 },
  { field: 'status', headerName: 'Status', width: 100,},
  {
    field: 'edit',
    headerName: 'Edit',
    width: 70,
    renderCell: (params: GridValueGetterParams) => (
      <IconButton variant="contained" color="primary" size="small" onClick={() => handleEdit(params.row.id)}>
        <EditIcon/>
      </IconButton>
    ),
  },
  {
    field: 'bookmark',
    headerName: 'Bookmark',
    width: 70,
    renderCell: (params: GridValueGetterParams) => (
      <IconButton variant="contained" color="secondary" size="small" onClick={() => handleBookmark(params.row.id)}>
        <BookmarkAddIcon/>
      </IconButton>
    ),
  },

];

const rows = [
  { id: 1, date: "27/08/2023", ReportName: 'Report 1', carYear: 2023, creatorName: 'Jon', status: 'Open'},
  { id: 2, date: "27/08/2023", ReportName: 'Report 2', carYear: 2023, creatorName: 'Kyle', status: 'Open'},
  { id: 3,date: "27/08/2023", ReportName: 'Report 3', carYear: 2022, creatorName: 'Kyle', status: 'Open'},
  { id: 4,date: "27/08/2023", ReportName: 'Report 4', carYear: 2023, creatorName: 'Lan' , status: 'Open'},
  { id: 5,date: "27/08/2023", ReportName: 'Report 5', carYear: 2022, creatorName: 'Steve', status: 'Open' },
  { id: 6,date: "27/08/2023", ReportName: 'Report 6', carYear: 2021, creatorName: 'Jan', status: 'Open' },
  { id: 7,date: "27/08/2023", ReportName: 'Report 7', carYear: 2023, creatorName: 'Red', status: 'Open' },
  { id: 8,date: "27/08/2023", ReportName: 'Report 8', carYear: 2023, creatorName: 'James', status: 'Open' },
  { id: 9,date: "27/08/2023", ReportName: 'Report 9', carYear: 2023, creatorName: 'Mary', status: 'Open' },
];

export default function DataTable() {
    const [searchTerm, setSearchTerm] = React.useState('');
  
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };

    const handleEdit = (id: number) => {
      console.log(`Edit report with ID: ${id}`);
    };
  
    const handleBookmark = (id: number) => {
      console.log(`Bookmark report with ID: ${id}`);
    };
  
    const filteredRows = rows.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  
    return (
      <div style={{ height: 400, width: '100%' }}>
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
          pageSize={5}
          checkboxSelection
        />
      </div>
    );
  }