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

import DeleteConfirmation from "@/components/Dialogs/DeleteConfirmation";
import * as React from "react";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  MuiEvent,
} from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Link from '@mui/material/Link';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { API_CLIENT, API_ENDPOINT, API_TYPES } from "@/helpers/api";
import { AxiosError, AxiosResponse } from "axios";
import Grid from '@mui/material/Unstable_Grid2';
import ReportStatusMessage from "@/components/ReportStatusMessage";
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";

const disableSelectBtns = (
  params: GridCellParams,
  event: MuiEvent<React.MouseEvent>
) => {
  if (["edit", "view", "delete"].includes(params.field)) {
    event.stopPropagation();
    event.defaultMuiPrevented = true;
  }
};

export interface UserReport {
  id: number;
  created_at: string;
  title: string;
  owner: string;
  car_year: number;
}

export interface Props {
  rows: UserReport[];
  setRows: React.Dispatch<React.SetStateAction<UserReport[]>>;
  initialstate?: GridInitialStateCommunity;
  search?: Boolean
  width_subtract?: number
  // showDelete: boolean;
}

const defaultstate: GridInitialStateCommunity = {
  sorting: {
    sortModel: [{ field: 'modified_at', sort: 'desc' }]
  },
    columns: {
      columnVisibilityModel: {
        creator: false,
        created_at: false,
        description: false
      },
    },
}

// Filtering can be done when the columns are defined, in case
// columns need to be changed in the future
//
// export function selectCols(data: API_TYPES.REPORT.GET.RESPONSE[]) {
//   console.log(data);
//   return data.map((e) => {
//     return {
//       id: e.id || -1,
//       title: e.title || "?",
//       created_at: e.created_at || "?",
//       status: "Open" || "?",
//       car_year: e.car_year || -1,
//       creator: e.creator.name || "?",
//     };
//   });
// }

// Function to show description as a column
// function ExpandableCell({ value }: GridRenderCellParams) {
//   const [expanded, setExpanded] = React.useState(false);

//   return (
//     <div>
//       {expanded ? value : value.slice(0, 200)}&nbsp;
//       {value.length > 200 && (
//         // eslint-disable-next-line jsx-a11y/anchor-is-valid
//         <Link
//           type="button"
//           component="button"
//           sx={{ fontSize: 'inherit' }}
//           onClick={() => setExpanded(!expanded)}
//         >
//           {expanded ? 'view less' : 'view more'}
//         </Link>
//       )}
//     </div>
//   );
// }


const ReportList: React.FC<Props> = ({ rows, setRows, initialstate, search, width_subtract }) => {
  if (initialstate === undefined) {
    initialstate = defaultstate;
  }
  if (search === undefined) {
    search = true;
  }
  if (width_subtract === undefined) {
    width_subtract = 0;
  }
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [deleteFunction, setDeleteFunction] = useState<
    React.MouseEventHandler<HTMLButtonElement> | undefined
  >(undefined);
  const [showDelete, setShowDelete] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getObjectName = (e: Object) => {
    if (e) {
      // @ts-ignore
      if (e.name) {
        // @ts-ignore
        return e.name
      } else {
        return ""
      }
    }
    return ""
  }

  const everyoneColumns: GridColDef[] = [
    { field: "title", 
      headerName: "Report",
      minWidth: 200,
      flex: 0.5,
      filterable: false,
      align: "left",
      
      renderCell: (params) => (
        <Link href={`/viewreport/${params.row.id}`} 
        sx={{ fontWeight: 'bold', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', marginY: 1}}>
          {params.row.title}
        </Link>
      ),
     },
     { field: "description", 
      headerName: "Description",
      minWidth: 150,
      flex: 0.50,
      filterable: false,
      align: "left",
      valueGetter: (params) => {
        if (params.row.description){
          return params.row.description
        } else {
          return "..."
        }},
      renderCell: (params) => (
        <div style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>
        <i>{params.row.description || "..."}</i>
        </div>
      )
     },
    { field: "created_at",
    headerName: "Created At",
    type: 'date',
    valueGetter: ({ value }) => value && new Date(value + "Z"),
    valueFormatter: ({ value }) => value.toLocaleDateString(),
    width: 120,
    //flex: 0.25,
    },
    { field: "modified_at",
    headerName: "Last Modified",
    type: 'date',
    valueGetter: ({ value }) => value && new Date(value + "Z"),
    valueFormatter: ({ value }) => value.toLocaleDateString(),
    width: 135,
    //flex: 0.25,
    },
    { field: "team", 
    headerName: "Team (Subsystem)", 
    valueGetter: (params) => {
      if (params.row.team && params.row.subsystem){
        return params.row.team.name + " / " + params.row.subsystem.name
      } else if (params.row.team) {
        return params.row.team.name
      } else {
        return ""
      }},
    renderCell: (params) => (
      <div>
      <b>{getObjectName(params.row.team) || "..."}</b><br/>{"↳ " + (getObjectName(params.row.subsystem) || "...")}
      </div>
    ),
    
    minWidth: 150,
    flex: 0.5, 
    },
    { 
    field: "car_year", 
    headerName: "Car Year", 
    width: 70,
    type: 'number',
    valueGetter: ({ value }) => value && Number(value),
    valueFormatter: ({ value }) => value.toString(),
    },
    {
      field: "owner",
      headerName: "Owner",
      minWidth: 100,
      flex: 0.35,
      renderCell: (params) => (
        <div>
        {(getObjectName(params.row.owner) || getObjectName(params.row.creator)) || "..."}
        </div>
      ),
    },
    {
      field: "creator",
      headerName: "Creator",
      minWidth: 100,
      flex: 0.35,
      renderCell: (params) => (
        <div>
        {getObjectName(params.row.creator) || "..."}
        </div>
      ),
    },
    {
      field: "stage",
      headerName: "Stage",
      minWidth: 130,
      //flex: 0.35,
      renderCell: (params) => (
          <ReportStatusMessage status={params.row.stage} messageOnly={false}/>
      )
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 25,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
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
  ];

  const superColumns: GridColDef[] = [
    {
      field: "delete",
      headerName: "Delete",
      width: 70,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <IconButton
          color="primary"
          aria-label="Delete"
          onClick={() => {
            setShowDeleteDialog(true);
            setDeleteFunction(() => () => {
              console.log(`Removed item ${params.row.id}`);
              setRows(rows.filter((item) => item.id !== params.row.id));
              (async () => {
                try {
                  const response = await API_CLIENT.delete(
                    `${API_ENDPOINT.RECORD}/${params.row.id}`
                  )
                    .then((response) => {})
                    .catch((error: AxiosError) => {
                      console.error("An error occurred " + error.message);
                    });
                } catch (error: any) {}
              })();
            });
          }}
          // href={`/viewreport/${params.row.id}`}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const columns = showDelete
    ? [...everyoneColumns, ...superColumns]
    : everyoneColumns;

  const filteredRows = rows.filter((row) =>
    Object.entries(row).some((value) =>
      {if (typeof value[1] === 'object') {
        return getObjectName(value).toString().toLowerCase().includes(searchTerm.toLowerCase());
      } else if (value[0] != ("created_at" || "modified_at")) {
        return value[1]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      };}
    )
  );
  //console.log(filteredRows)

  // Get user privileges
  useEffect(() => {
    (async () => {
      try {
        const response = await API_CLIENT.get<
          API_TYPES.NULLREQUEST_,
          AxiosResponse<API_TYPES.USER.RESPONSE>
        >(API_ENDPOINT.USER + "/current", {})
          .then((response) => {
            if (response) {
              if (response.data.leading != undefined) {
                setShowDelete(true);
              }
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

  return (
      <Grid 
      container spacing={{ xs: 1, md: 2 }} 
      marginBottom={{ xs: 1, md: 2 }} 
      width={{xs: "inherit", sm: "100%"}}
      >
      <DeleteConfirmation
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        onDelete={deleteFunction}
      />{search ? (
          <Grid xs={12}>
            <TextField
              label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
        ) : (<></>)}
        <Grid xs={12}>
        <DataGrid
          initialState={initialstate}
          rows={filteredRows}
          columns={columns}
          pagination
          pageSizeOptions={[5, 25, 100]}
          //checkboxSelection
          onCellClick={disableSelectBtns}
          getRowHeight={() => 'auto'}
          getEstimatedRowHeight={() => 200}
          density="standard"
          //sortModel={[{ field: "created_at", sort: "desc" }]}
          autoHeight {...filteredRows}
          sx={{overflowX: "scroll"}}
        />
        </Grid>
      </Grid>
  );
}

export default ReportList;