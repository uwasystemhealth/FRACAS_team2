import { API_TYPES } from "@/helpers/api";
import FormControl from "@mui/material/FormControl/FormControl";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Control } from "react-hook-form";
import { Controller } from "react-hook-form/dist/controller";

export interface Props {
  control: Control;
  subsystems: API_TYPES.SUBSYSTEM.GET.RESPONSE[];
}

const SubsystemSelector = (props: Props) => {
  const { control, subsystems } = props;

  // State for handling the input field
  const [newSubsystemName, setNewSubsystemName] = useState("");

  // Handler for adding a new subsystem
  const handleAddSubsystem = () => {
    if (newSubsystemName) {
      onAddSubsystem(newSubsystemName);
      setNewSubsystemName("");
    }
  };

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
              <MenuItem value={system.id}>{system.subsystem}</MenuItem>
            ))}
            <MenuItem value="addNew">+ Add New Subsystem</MenuItem>
          </Select>
        </FormControl>
      )}
    />
  );
};
export default SubsystemSelector;
