"use client";

/*
 * Better FRACAS
 * Copyright (C) 2023  Peter Tanner, ??? Better Fracas team
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

import { yupResolver } from "@hookform/resolvers/yup";
import { FormControlLabel, TextField } from "@mui/material/";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import {
  API_CLIENT,
  API_DATE_FORMAT,
  API_ENDPOINT,
  API_TYPES,
} from "@/helpers/api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";

import { get_client_tz } from "@/helpers/client_utils";
import { DateTimeField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import URLS from "@/helpers/urls";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs().format();

const steps = ["Record", "Analysis", "Correction"];

const schema = yup.object().shape({
  title: yup.string().nullable(),
  description: yup.string().nullable(), //.min
  subsystem_id: yup.number().nullable(),
  time_of_failure: yup.string().required(),
  impact: yup.string().nullable(),
  cause: yup.string().nullable(),
  mechanism: yup.string().nullable(),
  corrective_action_plan: yup.string().nullable(),
  car_year: yup.number().nullable(),
  team_id: yup.number().nullable(),
});
export type IFormInputs = yup.InferType<typeof schema>;

interface Props {
  params: {
    id: number;
  };
}

export default function EditReport(props: Props) {
  const record_id = props.params.id;

  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [teams, setTeams] = useState<API_TYPES.TEAM.GET.RESPONSE[]>([]);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });
  const [subsystems, setSubsystems] = useState<
    API_TYPES.SUBSYSTEM.GET.RESPONSE[]
  >([]);
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
      } catch (error: any) {}
      try {
        const response = await API_CLIENT.get<
          any,
          AxiosResponse<API_TYPES.TEAM.GET.RESPONSE[]>
        >(API_ENDPOINT.TEAM, {})
          .then((response) => {
            if (response) {
              setTeams(response.data);
            } else {
              console.error("An error occurred");
            }
          })
          .catch((error: AxiosError) => {
            console.error("An error occurred " + error.message);
          });
      } catch (error: any) {}
      try {
        const response = await API_CLIENT.get<
          any,
          AxiosResponse<API_TYPES.REPORT.GET.RESPONSE>
        >(API_ENDPOINT.RECORD + "/" + record_id)
          .then((response) => {
            if (response) {
              const report = response.data;
              console.log(response.data);
              reset({
                title: report.title,
                description: report.description,
                subsystem_id: report.subsystem?.id,
                team_id: report.team?.id,
                // @ts-ignore: dayjs object is not a string but we can't use
                // dayjs objects in yup date
                time_of_failure: dayjs.utc(
                  report.time_of_failure,
                  "YYYY-MM-DD HH:mm:ss"
                ),
                impact: report.impact,
                cause: report.cause,
                mechanism: report.mechanism,
                corrective_action_plan: report.corrective_action_plan,
                car_year: report.car_year,
              });
            } else {
              console.error("An error occurred");
            }
          })
          .catch((error: AxiosError) => {
            if (error.response?.status === 404) {
              router.push("/404");
            }
            console.error("An error occurred " + error.message);
          });
      } catch (error: any) {}
    })();
  }, []);

  const handleNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    if (submitted) return;
    setSubmitted(true);
    console.log("data submitted: ", data);
    //  Not efficient, but I cannot find out how to override the default date format, since react-hook-form abstracts away the string conversion so we can't use .format().
    data.time_of_failure = dayjs(data.time_of_failure).format(API_DATE_FORMAT);
    (async () => {
      await API_CLIENT.patch(API_ENDPOINT.RECORD + "/" + record_id, data)
        .then((response) => {
          if (response.status !== 200) {
            console.error(
              "An error occurred " +
                response.status +
                " " +
                response.data.message
            );
          }
          router.push(URLS.RECORD_LIST);
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

  return (
    <Box sx={{ width: "100%" }}>
      <h1>{}</h1>
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
            {activeStep === 0 && (
              <Box sx={{ flexGrow: 1, py: 2 }}>
                <Grid container spacing={2}>
                  <Grid xs={10}>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          sx={{ py: 4 }}
                          label="Title"
                          variant="standard"
                          error={!!errors.title}
                          helperText={errors.title ? errors.title?.message : ""}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={3}>
                    <Controller
                      name="team_id"
                      control={control}
                      defaultValue={0}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="team">Team</InputLabel>
                          <Select
                            {...field}
                            labelId="team"
                            id="team"
                            label="Team"
                            value={field.value}
                          >
                            {teams.map((team) => (
                              <MenuItem value={team.id}>{team.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid xs={3}>
                    <Controller
                      name="subsystem_id"
                      control={control}
                      defaultValue={0}
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
                          error={!!errors.title}
                          helperText={errors.title ? errors.title?.message : ""}
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
                            label="Time of Failure"
                            variant="outlined"
                            // error={!!errors.title}
                            timezone={get_client_tz()}
                            helperText={
                              errors.title ? errors.title?.message : ""
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
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" gutterBottom>
                      Validation
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Record Valid?"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Box>
            )}
            {activeStep === 1 && (
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
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" gutterBottom>
                      Validation
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Analysis Valid?"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Box>
            )}
            {activeStep === 2 && (
              <Box sx={{ flexGrow: 1, py: 4 }}>
                <Grid container spacing={2}>
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
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" gutterBottom>
                      Validation
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Correction Valid?"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Box>
            )}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                type="button"
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
                  type="button"
                  onClick={handleNext}
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
}
