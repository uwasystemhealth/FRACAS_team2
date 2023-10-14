/*
 * Better FRACAS
 * Copyright (C) 2023  Peter Tanner
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
import { API_TYPES } from "@/helpers/api";
import FormControl from "@mui/material/FormControl/FormControl";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Control, Controller } from "react-hook-form";

export interface Props {
  control: Control;
  subsystems: API_TYPES.SUBSYSTEM.GET.RESPONSE[];
}

const SubsystemSelector = (props: Props) => {
  const { control, subsystems } = props;

  // State for handling the input field
  // const [newSubsystemName, setNewSubsystemName] = useState("");

  // // Handler for adding a new subsystem
  // const handleAddSubsystem = () => {
  //   if (newSubsystemName) {
  //     // onAddSubsystem(newSubsystemName);
  //     setNewSubsystemName("");
  //   }
  // };

  return (
    <Controller
      name="subsystem_id"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel id="subsystem">Subsystem</InputLabel>
          <Select
            {...field}
            labelId="subsystem"
            id="subsystem"
            label="Subsystem"
            // stupid MUI doesn't let me allow `undefined` as a
            // possible value, so have fun getting your console
            // spammed with warnings.
          >
            {subsystems.map((system) => (
              <MenuItem key={system.id} value={system.id}>{system.name}</MenuItem>
            ))}
            <MenuItem value="addNew">+ Add New Subsystem</MenuItem>
          </Select>
        </FormControl>
      )}
    />
  );
};
export default SubsystemSelector;
