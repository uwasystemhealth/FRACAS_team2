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
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import { API_CLIENT, API_ENDPOINT, API_TYPES } from "@/helpers/api";
import { AxiosError, AxiosResponse } from "axios";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import SnackbarAlert from '@/components/SnackbarAlert';
import NewUserDialog from '@/components/Dialogs/NewUser';
import ChangeTeamDialog from'@/components/Dialogs/ChangeTeam';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

interface User {
  id: number;
  email: string;
  name: string;
  superuser: boolean;
  can_validate: boolean
  team_id: number;
  team_name: string;
  is_leader: boolean;
}

const UserTable: React.FC = () => {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [ButtonsDisabled, setButtonsDisabled] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserID, setCurrentUserID] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [openNewUserDialog, setOpenNewUserDialog] = useState<boolean>(false);
  const [openChangeTeamDialog, setOpenChangeTeamDialog] = useState<boolean>(false);

  const handleSnackbarOpen = () => {
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  
  const handleOpenNewUserDialog = () => {
    setOpenNewUserDialog(true);
  };

  const handleCloseNewUserDialog = () => {
    setOpenNewUserDialog(false);
  };

  const handleOpenChangeTeamDialog = () => {
    setOpenChangeTeamDialog(true);
  };

  const handleCloseChangeTeamDialog = () => {
    setOpenChangeTeamDialog(false);
  };

  const handleAdminChange = (userId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    // Find the user by userId
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, superuser: event.target.checked };
      }
      return user;
    });

    setUsers(updatedUsers);

    const userToUpdate = updatedUsers.find((user) => user.id === userId);
    if (userToUpdate) {
        API_CLIENT.put(`/api/v1/user/${userId}`, { superuser: event.target.checked })
        .then((response) => {
          if (response.status === 200) {
            handleRefresh();
            setSnackbarMessage(response.data.message);
            setSnackbarSeverity('success');
            handleSnackbarOpen();
          } else {
            setSnackbarMessage(response.data.message);
            setSnackbarSeverity('error');
            handleSnackbarOpen();
          }
        })
        .catch((error: AxiosError) => {
          setSnackbarMessage(error.message);
          setSnackbarSeverity('error');
          handleSnackbarOpen();
        })
    }
  };

  const handleValidateChange = (userId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    // Find the user by userId
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, can_validate: event.target.checked };
      }
      return user;
    });

    setUsers(updatedUsers);

    const userToUpdate = updatedUsers.find((user) => user.id === userId);
    if (userToUpdate) {
        API_CLIENT.put(`/api/v1/user/${userId}`, { can_validate: event.target.checked })
        .then((response) => {
          if (response.status === 200) {
            handleRefresh();
            setSnackbarMessage(response.data.message);
            setSnackbarSeverity('success');
            handleSnackbarOpen();
          } else {
            setSnackbarMessage(response.data.message);
            setSnackbarSeverity('error');
            handleSnackbarOpen();
          }
        })
        .catch((error: AxiosError) => {
          setSnackbarMessage(error.message);
          setSnackbarSeverity('error');
          handleSnackbarOpen();
        })
    }
  };

  const handleRowSelection = (ids: any) => {
    if (ids) {
      setSelectedRowId(ids[0]);
      setButtonsDisabled(false);
    } else {
      setSelectedRowId(null);
      setButtonsDisabled(true);
    }
  };

  const fetchCurrentUser = () => {
    API_CLIENT.get(API_ENDPOINT.USER + `/current`)
      .then((response) => {
        if (response.status == 200) {
          setCurrentUserID(response.data.id);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error: AxiosError) => {
        console.error(error.message);
      });
  };

  // Initial API Call to get list of users
  const fetchData = async () => {
    try {
      await API_CLIENT.get(API_ENDPOINT.USER)
        .then((response) => {
          if (response.status == 200) {
            setUsers(response.data);
            setLoading(false);
          } else {
            setLoading(false);
            window.alert("Unable to get users list: " + response.data.message);
          }
        })
        .catch((error: AxiosError) => {
          setLoading(false);
          window.alert("Unable to get users list: " + error.message);
        })
    } catch (error: any) {
      setLoading(false);
        window.alert("Unable to get users list: " + error.message);
      }
  };
  
  // Runs fetchData() when page is initally loaded
  useEffect(() => {
    fetchCurrentUser();
    fetchData();
  }, []);

  const handleRefresh = () => {
    // Set loading to true to indicate a new data fetch
    setLoading(true);
    fetchData();
  };

  const handleDelete = async () => {
    await API_CLIENT.delete(API_ENDPOINT.USER + `/${selectedRowId}`)
        .then((response) => {
          if (response.status == 200) {
            handleRefresh();
            window.alert("User deleted.");
          } else {
            window.alert("Error: " + response.data.message);
          }
        })
        .catch((error: AxiosError) => {
          window.alert("Error: " + error.message);
        })
  };

  const handleCreateUser = async (newUser: { name: string; email: string; }) => {
      await API_CLIENT.post(API_ENDPOINT.USER, newUser)
        .then((response) => {
          if (response.status == 200) {
            window.alert("User invite sent.")
            handleRefresh();
          } else {
            window.alert("Error: " + response.data.message);
          }
        })
        .catch((error: AxiosError) => {
          window.alert("Error: " + error.message);
        })
  };
  
  const handleChangeTeam = async (newTeamId: number) => {
    await API_CLIENT.put(API_ENDPOINT.USER + `/${selectedRowId}`, {team_id: newTeamId})
        .then((response) => {
          if (response.status == 200) {
            window.alert("Team change successful.")
            handleRefresh();
          } else {
            window.alert("Error: " + response.data.message);
          }
        })
        .catch((error: AxiosError) => {
          window.alert("Error: " + error.message);
        })
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Full Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'team_name',
      headerName: 'Team',
      width: 200,
      renderCell: (params) => (
        <div>
        {(params.row.is_leading) ? (params.row.team_name + " ★") : (params.row.team_name)}
        </div>
      ),
    },
    {
      field: 'can_validate',
      headerName: 'Can Validate?',
      width: 120,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={params.value}
          onChange={handleValidateChange(params.row.id)}
          disabled={(params.row.is_leading) || (params.row.id == currentUserID) || (params.row.id == "Admin")}
        />
      ),
    },
    {
      field: 'superuser',
      headerName: 'Is Admin?',
      width: 120,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={params.value}
          onChange={handleAdminChange(params.row.id)}
          disabled={(params.row.id == currentUserID) || (params.row.name == "Admin")}
        />
      ),
    },
  ];

  return (
    <React.Fragment>
      <DataGrid
        autoHeight={true}
        rows={users}
        columns={columns}
        onRowSelectionModelChange={(ids) => handleRowSelection(ids)}
        getRowId={(row) => row.id}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
      <Stack sx={{ marginTop: '20px' }} direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
      <Button 
        variant="contained"
        color="info" 
        onClick={handleOpenNewUserDialog}>
        Create New User
      </Button>
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={ButtonsDisabled}
        >
          Delete User
        </Button>
        <Button 
          variant="contained"
          color="info" 
          disabled={ButtonsDisabled}
          onClick={handleOpenChangeTeamDialog}>
          Change Team
        </Button>
      </ButtonGroup>
      </Stack>
      <NewUserDialog
        open={openNewUserDialog}
        onClose={handleCloseNewUserDialog}
        onSubmit={handleCreateUser}
      />
      <ChangeTeamDialog
        open={openChangeTeamDialog}
        onClose={handleCloseChangeTeamDialog}
        onSubmit={handleChangeTeam}
      />
      <SnackbarAlert
        open={openSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </React.Fragment>
  );
};
export default UserTable;
