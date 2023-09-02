"use client";

/*
 * Better FRACAS
 * Copyright (C) 2023  ??? Better Fracas team
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

import React, { FC } from "react";
import { TextField } from "@mui/material/";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";

const steps = ["Record Entry", "Analysis", "Review"];

interface IFormInputs {
  failure_title: string;
  description: string;
  impact: string;
  cause: string;
  mechanism: string;
  corrective_action: string;
  subsystem: string;
  car_year: number;
  team_id: number;
  failure_time: string;
}

const schema = yup.object().shape({
  failure_title: yup.string().required(),
  description: yup.string().min(5).required(),
  impact: yup.string(),
  cause: yup.string(),
  mechanism: yup.string(),
  corrective_action: yup.string(),
  subsystem: yup.string().required(),
  car_year: yup.number(),
  team_id: yup.number().required(),
  failure_time: yup.string().required(),
});

export default function CreateReport() {
  const [team, setTeam] = React.useState("");
  const [subsystem, setSubsystem] = React.useState("");

  const teamChange = (event: SelectChangeEvent) => {
    setTeam(event.target.value as string);
  };

  const subsystemChange = (event: SelectChangeEvent) => {
    setSubsystem(event.target.value as string);
  };

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IFormInputs> = (data) =>
    console.log("data submitted: ", data);

  //console.log(watch('email'));
  //console.log('errors are', errors);

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <form onSubmit={handleSubmit(onSubmit)}>
            {(activeStep === 0 || activeStep === 2) && (
              <Box sx={{ flexGrow: 1, py: 2 }}>
                <Grid container spacing={2}>
                  <Grid xs={10}>
                    <Controller
                      name="failure_title"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          sx={{ py: 4 }}
                          label="Title"
                          variant="standard"
                          error={!!errors.failure_title}
                          helperText={
                            errors.failure_title
                              ? errors.failure_title?.message
                              : ""
                          }
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={3}>
                    <Controller
                      name="team_id"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="team">Team</InputLabel>
                          <Select
                            {...field}
                            labelId="team"
                            id="team"
                            value={team}
                            label="Team"
                            onChange={teamChange}
                          >
                            <MenuItem value={1}>Powertrain</MenuItem>
                            <MenuItem value={2}>Suspension</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid xs={3}>
                    <Controller
                      name="subsystem"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="subsystem">Subsystem</InputLabel>
                          <Select
                            {...field}
                            labelId="subsystem"
                            id="subsystem"
                            value={subsystem}
                            label="Subsystem"
                            onChange={subsystemChange}
                          >
                            <MenuItem value={1}>PDK</MenuItem>
                            <MenuItem value={2}>Exhaust</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Divider orientation="vertical" flexItem></Divider>
                  <Grid xs={2}>
                    <Controller
                      name="car_year"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Car Year"
                          variant="outlined"
                          error={!!errors.failure_title}
                          helperText={
                            errors.failure_title
                              ? errors.failure_title?.message
                              : ""
                          }
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={2}>
                    <Controller
                      name="failure_time"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Time of Failure"
                          variant="outlined"
                          error={!!errors.failure_title}
                          helperText={
                            errors.failure_title
                              ? errors.failure_title?.message
                              : ""
                          }
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Description"
                          variant="outlined"
                          error={!!errors.description}
                          helperText={
                            errors.description
                              ? errors.description?.message
                              : ""
                          }
                          fullWidth
                          multiline
                          minRows={4}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {(activeStep === 1 || activeStep === 2) && (
              <Box sx={{ flexGrow: 1, py: 4 }}>
                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <Controller
                      name="impact"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Impact"
                          variant="outlined"
                          error={!!errors.impact}
                          helperText={
                            errors.impact ? errors.impact?.message : ""
                          }
                          fullWidth
                          multiline
                          minRows={4}
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Controller
                      name="cause"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Cause"
                          variant="outlined"
                          error={!!errors.cause}
                          helperText={errors.cause ? errors.cause?.message : ""}
                          fullWidth
                          multiline
                          minRows={4}
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Controller
                      name="mechanism"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Mechanism"
                          variant="outlined"
                          error={!!errors.mechanism}
                          helperText={
                            errors.mechanism ? errors.mechanism?.message : ""
                          }
                          fullWidth
                          multiline
                          minRows={4}
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Controller
                      name="corrective_action"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Corrective Action Plan"
                          variant="outlined"
                          error={!!errors.corrective_action}
                          helperText={
                            errors.corrective_action
                              ? errors.corrective_action?.message
                              : ""
                          }
                          fullWidth
                          multiline
                          minRows={4}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </form>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {activeStep === steps.length - 1 ? (
              <Button type="submit" variant="contained">
                Submit
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
              >
                Next
              </Button>
            )}
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}