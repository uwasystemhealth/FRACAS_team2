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

import React, { ChangeEventHandler, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Team } from "@/components/ViewReportComponents/TeamMenu";
import { API_CLIENT, API_ENDPOINT } from "@/helpers/api";
import { AxiosError } from "axios";

interface NewUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newUser: {
    name: string;
    email: string;
    password: string;
  }) => void;
}

const NewUser: React.FC<NewUserDialogProps> = ({ open, onClose, onSubmit }) => {
  const onCloseInternal = () => {
    setUser({
      name: "",
      email: "",
      password: "",
      team: "-1",
    });
    onClose();
  };

  const [teams, setTeams] = useState<Team[]>([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    team: "-1",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    handleInputChange(event as React.ChangeEvent<HTMLInputElement>);
  };

  const handleSubmit = () => {
    onSubmit(user);
    onCloseInternal();
    setUser({
      name: "",
      email: "",
      password: "",
      team: "-1",
    });
  };

  const fetchTeam = () => {
    API_CLIENT.get(API_ENDPOINT.TEAM)
      .then((response) => {
        if (response) {
          setTeams(response.data);
        } else {
          setTeams([{ id: "-1", name: "An error occurred loading Teams" }]);
        }
      })
      .catch((error: AxiosError) => {
        setTeams([
          {
            id: "-1",
            name: "An error occurred loading Teams " + error.message,
          },
        ]);
      });
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <Dialog open={open} onClose={onCloseInternal}>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the details of the new user:
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          name="name"
          fullWidth
          value={user.name}
          onChange={handleInputChange}
        />
        {/* TODO: Should we do email validation? One philosophy is simply 
            allowing any email, and if the validation email is not received then
            that is okay. */}
        <TextField
          margin="dense"
          label="Email"
          type="email"
          name="email"
          fullWidth
          value={user.email}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          name="password"
          fullWidth
          value={user.password}
          onChange={handleInputChange}
        />
        <FormControl fullWidth>
          <InputLabel>Team</InputLabel>
          <Select
            label="Team"
            name="team"
            value={user.team}
            fullWidth
            onChange={handleSelectChange}
          >
            {teams.map((team) => (
              <MenuItem value={team.id}>{team.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseInternal} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewUser;
