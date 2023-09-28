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
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { API_CLIENT, API_TYPES, API_ENDPOINT } from "@/helpers/api";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import SnackbarAlert from '@/components/SnackbarAlert';
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
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openNewTeamDialog, setOpenNewTeamDialog] = useState<boolean>(false);
  const [openChangeLeaderDialog, setOpenChangeLeaderDialog] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarOpen = () => {
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

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
      setSelectedRowId(ids[0]);
      setButtonsDisabled(false);
    } else {
      setSelectedRowId(null);
      setButtonsDisabled(true);
    }
  };

  // Initial API Call to get list of teams
  const fetchData = async () => {
    try {
      await API_CLIENT.get(API_ENDPOINT.TEAM)
        .then((response) => {
          if (response.status == 200) {
            setTeams(response.data);
            setLoading(false);
          } else {
            setLoading(false);
            setSnackbarMessage('Unable to fetch teams list');
            setSnackbarSeverity('error');
            handleSnackbarOpen();
          }
        })
        .catch((error: AxiosError) => {
          setLoading(false);
          setSnackbarMessage('Unable to fetch teams list');
          setSnackbarSeverity('error');
          handleSnackbarOpen();
        })
    } catch (error: any) {
      setLoading(false);
        setSnackbarMessage('Something went wrong internally');
        setSnackbarSeverity('error');
        handleSnackbarOpen();}
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

  const handleDelete = async () => {
    if (selectedRowId !== null) {
      await API_CLIENT.delete(API_ENDPOINT.TEAM + `/${selectedRowId}`)
        .then((response) => {
          if (response.status == 200) {
            handleRefresh();
            setSnackbarMessage(response.data.message);
            setSnackbarSeverity('success');
            handleSnackbarOpen();
          } else {
            setSnackbarMessage(response.data.message);
            setSnackbarSeverity('error');
            handleSnackbarOpen();
        }})
        .catch((error: AxiosError) => {
          setSnackbarMessage(error.message);
          setSnackbarSeverity('error');
          handleSnackbarOpen();
        })
      }
    };

  const handleNew = async (teamname: string) => {
      await API_CLIENT.post(API_ENDPOINT.TEAM, {name: teamname})
        .then((response) => {
          if (response.status === 201) {
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
        });
    };

  const handleChangeLeader = async (UserID: number) => {
    await API_CLIENT.put(API_ENDPOINT.TEAM + `/${selectedRowId}/leader/${UserID}`)
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
        src={selectedRowId}
        input_id={selectedRowId}
        open={openChangeLeaderDialog}
        onClose={handleCloseChangeLeaderDialog}
        onSubmit={handleChangeLeader}
      />
      <NewTeamDialog
        open={openNewTeamDialog}
        onClose={handleCloseNewTeamDialog}
        onSubmit={handleNew}
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
export default TeamTable;
