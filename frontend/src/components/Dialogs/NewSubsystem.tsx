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
import { Dialog, DialogContent, TextField, Button } from '@mui/material';

interface NewSubsystemDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

const NewSubsystemDialog: React.FC<NewSubsystemDialogProps> = ({ open, onClose, onSubmit }) => {
  const [text, setText] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(text);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <TextField
          label="Enter new subsystem name"
          variant="outlined"
          fullWidth
          value={text}
          onChange={handleTextChange}
        />
      </DialogContent>
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Submit
      </Button>
    </Dialog>
  );
};

export default NewSubsystemDialog;
