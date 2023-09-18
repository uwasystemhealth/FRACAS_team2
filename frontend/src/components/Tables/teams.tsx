/*
 * Better FRACAS
 * Copyright (C) 2023 Peter Tanner, Insan Basrewan Better Fracas team
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
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { AxiosError } from "axios";
import { API_CLIENT, API_TYPES, API_ENDPOINT } from "@/helpers/api";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import NewTeamDialog from '@/components/Dialogs/NewTeam';
import ChangeLeaderDialog from '@/components/Dialogs/ChangeLeader';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

interface Team {
  id: number;
  name: string;
  leader_id: boolean;
  leader_name: string;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'leader_name', headerName: 'Leader', width: 200 },
];

const TeamTable: React.FC = () => {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [ButtonsDisabled, setButtonsDisabled] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [openNewTeamDialog, setOpenNewTeamDialog] = useState<boolean>(false);
  const [openChangeLeaderDialog, setOpenChangeLeaderDialog] = useState<boolean>(false);

  const handleOpenNewTeamDialog = () => {
    setOpenNewTeamDialog(true);
  };

  const handleCloseNewTeamDialog = () => {
    setOpenNewTeamDialog(false);
  };

  const handleOpenChangeLeaderDialog = () => {
    setOpenChangeLeaderDialog(true);
  };

  const handleCloseChangeLeaderDialog = () => {
    setOpenChangeLeaderDialog(false);
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

  // Initial API Call to get list of teams
  const fetchData = async () => {
    try {
      await API_CLIENT.get(`/api/v1/team`)
        .then((response) => {
          setTeams(response.data);
          setLoading(false);
        })
        .catch((error: AxiosError<API_TYPES.TEAM.RESPONSE>) => {setLoading(false);});
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
        .delete(`/api/v1/team/${selectedRowId}`)
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

  const handleNew = (teamname: string) => {
    API_CLIENT
        .post(`/api/v1/team`, {name: teamname})
        .then((response) => {
          if (response.status === 200) {
            // Backend responds with success message
            setSnackbarMessage('New Team Added');
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

  const handleChangeLeader = (UserID: number) => {
    // Make an API call to add the new user in via Axios
    API_CLIENT
    .put(`/api/v1/team/${selectedRowId}`, {leader: UserID})
    .then((response) => {
      if (response.status === 200) {
        // Backend responds with success message
        setSnackbarMessage('Leader Succesfully Changed');
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

  return (
    <React.Fragment>
      <DataGrid
        autoHeight={true}
        rows={teams}
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
          onClick={handleOpenNewTeamDialog}
          >
            Add Team
        </Button>
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={ButtonsDisabled}
          >
            Delete Team
          </Button>
          <Button 
            variant="contained"
            color="info" 
            disabled={ButtonsDisabled}
            onClick={handleOpenChangeLeaderDialog}>
            Change Leader
          </Button>
        </ButtonGroup>
      </Stack>
      <ChangeLeaderDialog
        open={openChangeLeaderDialog}
        onClose={handleCloseChangeLeaderDialog}
        onSubmit={handleChangeLeader}
      />
      <NewTeamDialog
        open={openNewTeamDialog}
        onClose={handleCloseNewTeamDialog}
        onSubmit={handleNew}
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
export default TeamTable;
