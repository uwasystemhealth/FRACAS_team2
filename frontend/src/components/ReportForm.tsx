"use client";

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

import React, { FC, useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { TextField } from "@mui/material/";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
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
import { API_CLIENT, API_ENDPOINT, API_TYPES } from "@/helpers/api";
import { AxiosError, AxiosResponse } from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const steps = ["Record Entry", "Analysis", "Review"];

interface IFormInputs {
  failure_title: string;
  description: string;
  impact: string;
  cause: string;
  mechanism: string;
  corrective_action_plan: string;
  subsystem_id: number;
  car_year: number;
  team_id: number;
  failure_time: string;
}

const defaultYear = new Date().getFullYear();
const time_of_failure = dayjs(new Date());

const schema = yup.object().shape({
  failure_title: yup.string(), //.required(),
  description: yup.string(), //.min(5).required(),
  subsystem_id: yup.number(), //.required(),
  time_of_failure: yup.string().default(time_of_failure.toString()), //.required(),
  impact: yup.string(),
  cause: yup.string(),
  mechanism: yup.string(),
  corrective_action_plan: yup.string(),
  car_year: yup.number().default(defaultYear),
  team_id: yup.number(), //.required(),
});

export type UserForm = yup.InferType<typeof schema>;

interface Props {
  report_id?: number; // if no report_id given, assume we are creating a new report
}

const ReportForm = (props: Props) => {
  const { report_id } = props;

  const [activeStep, setActiveStep] = useState(0);
  const [teams, setTeams] = useState<Array<number>>([]);
  const [subsystems, setSubsystems] = useState<
    API_TYPES.SUBSYSTEM.GET.RESPONSE[]
  >([]);

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
  } = useForm<UserForm>({
    resolver: yupResolver(schema),
  });

  const onValid: SubmitHandler<UserForm> = (data, event) => {
    (async () => {
      await API_CLIENT.post(API_ENDPOINT.RECORD, data)
        .then((response) => {
          if (response.status !== 200) {
            console.error(
              "An error occurred " +
                response.status +
                " " +
                response.data.message
            );
          }
        })
        .catch((error: AxiosError) => {
          console.error(
            "An error occurred " +
              error.message +
              // @ts-ignore: TODO: Add types for generic error response
              error.response?.data["message"]
          );
        });
      console.log("data submitted: ", data);
    })();
  };
  //console.log(watch('email'));
  //console.log('errors are', errors);

  useEffect(() => {
    (async () => {
      try {
        const response = await API_CLIENT.get<
          any,
          AxiosResponse<API_TYPES.SUBSYSTEM.GET.RESPONSE[]>
        >(API_ENDPOINT.SUBSYSTEM, {})
          .then((response) => {
            if (response) {
              setSubsystems(response.data);
            } else {
              console.error("An error occurred");
            }
          })
          .catch((error: AxiosError) => {
            console.error("An error occurred " + error.message);
          });

        // Do something with the token (e.g., store it)
      } catch (error: any) {}
    })();
  }, []);

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
          <form
            onSubmit={handleSubmit(onValid, (e) => console.error("error", e))}
          >
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
                  {/* TODO: WHEN TEAMS/ADMIN BRANCH IS MERGED ADD LOGIC FOR THIS */}
                  {/* <Grid xs={3}>
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
                            label="Team"
                          >
                            <MenuItem value={1}>Powertrain</MenuItem>
                            <MenuItem value={2}>Suspension</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid> */}
                  <Grid xs={3}>
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
                              <MenuItem value={system.id}>
                                {system.subsystem}
                              </MenuItem>
                            ))}
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
                          defaultValue={defaultYear}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={2}>
                    <Controller
                      name="time_of_failure"
                      control={control}
                      render={({ field }) => (
                        <LocalizationProvider
                          // localeText={
                          //   enUS.components.MuiLocalizationProvider.defaultProps
                          //     .localeText
                          // }
                          dateAdapter={AdapterDayjs}
                        >
                          <DateTimeField
                            format="YYYY-MM-DD[T]HH:mm"
                            {...field}
                            defaultValue={time_of_failure}
                            label="Time of Failure"
                            variant="outlined"
                            // error={!!errors.failure_title}
                            timezone="Australia/West"
                            helperText={
                              errors.failure_title
                                ? errors.failure_title?.message
                                : ""
                            }
                            disableFuture={true} // time travellers beware...
                            fullWidth
                          />
                        </LocalizationProvider>
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
                      name="corrective_action_plan"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Corrective Action Plan"
                          variant="outlined"
                          error={!!errors.corrective_action_plan}
                          helperText={
                            errors.corrective_action_plan
                              ? errors.corrective_action_plan?.message
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
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                type="button"
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
                  type="button"
                  disabled={activeStep === steps.length - 1}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </React.Fragment>
      )}
    </Box>
  );
};

export default ReportForm;
