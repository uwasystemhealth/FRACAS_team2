/*
 * Better FRACAS
 * Copyright (C) 2023 Insan Basrewan Better Fracas team
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

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { API_CLIENT, API_ENDPOINT, API_TYPES } from "@/helpers/api";

interface ChangeTeamDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (id: number) => void;
}

const ChangeTeamDialog: React.FC<ChangeTeamDialogProps> = ({ open, onClose, onSubmit }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(undefined);
  
  const fetchData = async () => {
    try {
      await API_CLIENT.get(API_ENDPOINT.TEAM)
        .then((response) => {
          setTeams(response.data);
        })
        .catch((error) => {});
    } catch (error) {}
};

  // Runs fetchData() when page is initally loaded
  useEffect(() => {
    fetchData();
  }, []);


  const handleTeamChange = () => {
    if (selectedTeamId !== undefined) {
      onSubmit(selectedTeamId);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Team</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select a team to switch to:
        </DialogContentText>
        <Select
          value={selectedTeamId}
          onChange={(event) => setSelectedTeamId(event.target.value as number)}
          fullWidth
        >
          {teams.map((team: { id: number, name: string }) => (
            <MenuItem key={team.id} value={team.id}>
              {team.name}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleTeamChange} color="primary">
          Change
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeTeamDialog;
