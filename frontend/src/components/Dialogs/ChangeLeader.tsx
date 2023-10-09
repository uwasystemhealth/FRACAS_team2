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

interface ChangeLeaderDialogProps {
  input_id: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (id: number) => void;
}

const ChangeLeaderDialog: React.FC<ChangeLeaderDialogProps> = ({ input_id, open, onClose, onSubmit }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);
  
  const fetchData = async () => {
    try {
      await API_CLIENT.get(API_ENDPOINT.USER)
        .then((response) => {
          console.log(input_id)
          var team_list = response.data;
          var team_filtered = team_list.filter(user =>
            user.team_id === input_id
          );
          setUsers(team_filtered);
        })
        .catch((error) => {});
    } catch (error) {}
};

  // Runs fetchData() when page is initally loaded
  useEffect(() => {
    fetchData();
  }, []);


  const handleLeaderChange = () => {
    if (selectedUserId !== undefined) {
      onSubmit(selectedUserId);
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
          value={selectedUserId}
          onChange={(event) => setSelectedUserId(event.target.value as number)}
          fullWidth
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleLeaderChange} color="primary">
          Change
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeLeaderDialog;
