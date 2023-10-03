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
import { number } from "prop-types";
import { Control, Controller, FieldValues } from "react-hook-form";
import { API_TYPES } from "@/helpers/api";

export interface Team {
  id: string;
  name: string;
}

interface Props<T extends FieldValues> {
  // default_id: string;
  // field: any;
  name: string;
  id: string;
  label: string;
  teams: Team[];
  onSelectTeam: (teamId: string) => void;
  control: Control<T> | undefined;
}

function TeamMenu<T extends FieldValues>(props: Props<T>) {
  const {
    // default_id,
    // field,
    label,
    teams,
    name,
    id,
    onSelectTeam,
    control,
  } = props;
  return (
    <Controller
      name={name}
      defaultValue={0}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel id="team">Team</InputLabel>
          <Select
            {...field}
            labelId={id}
            id={id}
            label={label}
            value={field.value}
            //onChange={}
            fullWidth
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
            ))}
          </Select>
          <FormHelperText>Select a team</FormHelperText>
        </FormControl>
      )}
    />
  );
}

export default TeamMenu;
