
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

import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { number } from 'prop-types';

interface Team {
    id: string;
    name: string;
  }

interface Props {
    default_id: string;
    field: any;
    label: string;
    teams: Team[];
    onSelectTeam: (teamId: string) => void;
};

const TeamMenu: React.FC<Props> = ({ default_id, field, label, teams, onSelectTeam }) => {
    console.log(default_id)
    const [selectedTeamID, setSelectedTeamID] = useState<string>('');

    const handleTeamChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const teamID = event.target.value as string;
        setSelectedTeamID(teamID);
        onSelectTeam(teamID); // Call the callback to update the selected team ID in the parent component
      };
    

  return (
    <React.Fragment>
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        {...field}
        label={label}
        fullWidth
        value={selectedTeamID}
        onChange={handleTeamChange}
      >
        {teams.map((team) => (
          <MenuItem key={team.id} value={team.id}>
            {team.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Select a team</FormHelperText>
    </FormControl>
    </React.Fragment>
  );
};

export default TeamMenu;
