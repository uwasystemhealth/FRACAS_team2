/*
 * Better FRACAS
 * Copyright (C) 2023  Peter Tanner, Insan Basrewan, ??? Better Fracas team
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
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import NewSubsystemDialog from "@/components/Dialogs/NewSubsystem";
import Button from "@mui/material/Button";
import { API_CLIENT, API_ENDPOINT, API_TYPES } from "@/helpers/api";
import { Control, FieldValues, ControllerRenderProps } from "react-hook-form";

interface Subsystem {
  id: string;
  name: string;
}

interface Props<T extends FieldValues> {
  team_id: number;
  field: any;
  label: string;
}

function SubsysMenu<T extends FieldValues>({
  team_id,
  field,
  label,
}: Props<T>) {
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>("");
  const [subsystems, setSubsystems] = useState<Subsystem[]>([]);
  const handleSubsystemChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const subsysID = event.target.value as string;
    setSelectedSubsystem(subsysID);
  };

  const [NewSubsystemDialogOpen, setNewSubsystemDialog] = useState(false);

  const openNewSubsystemDialog = () => {
    setNewSubsystemDialog(true);
  };

  const handleDialogClose = () => {
    setNewSubsystemDialog(false);
  };

  const fetchSubsystem = () => {
    try {
      API_CLIENT.get(API_ENDPOINT.SUBSYSTEM + `/${team_id}`, {})
        .then((response) => {
          if (response) {
            setSubsystems(response.data);
          } else {
            console.error("An error occurred");
          }
        })
        .catch(() => {
          console.error("An error occurred ");
        });
    } catch (error: any) {}
  };

  // TODO: cache subsystem
  const createSubsystem = async (subsystemName: string) => {
    await API_CLIENT.post(API_ENDPOINT.SUBSYSTEM, {
      team_id: team_id,
      name: subsystemName,
    })
      .then((response) => {
        if (response.status == 201) {
          fetchSubsystem();
          setSelectedSubsystem(response.data.name);
          team_id = team_id
        } else {
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchSubsystem();
  }, [team_id]);

  return (
    <React.Fragment>
      <FormControl fullWidth>
        <InputLabel id="subsystem_name">Subsystem</InputLabel>
        <Select
        {...field}
        label={label}
        fullWidth
        >
          {subsystems.map((system) => (
            // TODO: change this from key={subsystem.name} to key={subsystem.id}
            // when changing subsystem to be indexed by id number
            <MenuItem key={system.name} value={system.name}>
              {system.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        size="small"
        variant="text"
        color="primary"
        onClick={openNewSubsystemDialog}
      >
        Add New Subsystem
      </Button>
      <NewSubsystemDialog
        open={NewSubsystemDialogOpen}
        onClose={handleDialogClose}
        onSubmit={createSubsystem}
      />
    </React.Fragment>
  );
}

export default SubsysMenu;
