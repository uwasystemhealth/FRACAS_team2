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
import { AxiosError } from "axios";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import NewUserDialog from '@/components/Dialogs/NewUser';
import ChangeTeamDialog from'@/components/Dialogs/ChangeTeam';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

interface User {
  id: number;
  email: string;
  name: string;
  superuser: boolean;
  team_id: number;
  team_name: string;
  is_leader: boolean;
}

const UserTable: React.FC = () => {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [ButtonsDisabled, setButtonsDisabled] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openNewUserDialog, setOpenNewUserDialog] = useState<boolean>(false);
  const [openChangeTeamDialog, setOpenChangeTeamDialog] = useState<boolean>(false);

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

  const handleToggleChange = (userId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
            setSnackbarMessage('User Updated');
            setSnackbarOpen(true);
            handleRefresh();
          }
        })
        .catch((error) => {
          console.error('Error updating user:', error);
        });
    }
  };


  const handleRowSelection = (ids) => {
    if (ids) {
      console.log(ids[0])
      setSelectedRowId(ids[0]);
      setButtonsDisabled(false);
    } else {
      setSelectedRowId(null);
      setButtonsDisabled(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  // Initial API Call to get list of users
  const fetchData = async () => {
      try {
        await API_CLIENT.get(`/api/v1/user`)
          .then((response) => {
            setUsers(response.data);
            setLoading(false);
          })
          .catch((error: AxiosError<API_TYPES.USER.RESPONSE>) => {setLoading(false);});
      } catch (error) {setLoading(false);}
  };
  
  // Runs fetchData() when page is initally loaded
  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    // Set loading to true to indicate a new data fetch
    setLoading(true);
    fetchData();
  };

  const handleDelete = () => {
    if (selectedRowId !== null) {
      // Make an API call to delete the selected row using Axios
      API_CLIENT
        .delete(`/api/v1/user/${selectedRowId}`)
        .then((response) => {
          if (response.status === 200) {
            // Backend responds with success message
            setSnackbarMessage('Row deleted successfully');
            setSnackbarOpen(true);
            handleRefresh();
            // Handle error response from the API
          } else {
            console.error('Failed to delete the row');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  const handleCreateUser = (newUser: { name: string; email: string; password: string }) => {
    // Make an API call to add the new user in via Axios
    API_CLIENT
    .post(`/api/v1/user`, newUser)
    .then((response) => {
      if (response.status === 200) {
        // Backend responds with success message
        setSnackbarMessage('User Created');
        setSnackbarOpen(true);
        handleRefresh();
        // Handle error response from the API
      } else {
        console.error('Failed to delete the row');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleChangeTeam = (newTeamId: number) => {
    // Make an API call to add the new user in via Axios
    API_CLIENT
    .put(`/api/v1/user/${selectedRowId}`, {team_id: newTeamId})
    .then((response) => {
      if (response.status === 200) {
        // Backend responds with success message
        setSnackbarMessage('Team Succesfully Changed');
        setSnackbarOpen(true);
        handleRefresh();
        // Handle error response from the API
      } else {
        console.error('Failed to delete the row');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };



  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Full Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'team_name', headerName: 'Team', width: 200 },
    {
      field: 'superuser',
      headerName: 'Is Admin?',
      width: 120,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={params.value}
          onChange={handleToggleChange(params.row.id)}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};
export default UserTable;
