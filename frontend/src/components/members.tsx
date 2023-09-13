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

import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import { API_CLIENT, API_ENDPOINT, API_TYPES } from "@/helpers/api";
import { AxiosError } from "axios";
import { Switch } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

interface User {
  id: number;
  fullname: string,
  email: string;
  team: string;
  registered: boolean;
  superuser: boolean;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'fullname', headerName: 'Full Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'team', headerName: 'Team', width: 200 },
];

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      try {
        await API_CLIENT.get<API_TYPES.USER.RESPONSE[]>(API_ENDPOINT.USER)
          .then((response) => {
            setUsers(response.data);
          })
          .catch((error: AxiosError<API_TYPES.USER.RESPONSE>) => {});
      } catch (error) {}
    })();
  }, []);

  return (
    <React.Fragment>
      <DataGrid
        autoHeight={true}
        rows={users}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </React.Fragment>
  );
}
export default UserTable;
