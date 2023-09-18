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

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

interface NewUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newUser: { name: string; email: string; password: string }) => void;
}

const NewUser: React.FC<NewUserDialogProps> = ({ open, onClose, onSubmit }) => {
  const [user, setUser] = useState({ name: '', email: '', password: '' });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(user);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
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
