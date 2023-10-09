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

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material/";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { API_CLIENT, API_DATE_FORMAT, API_ENDPOINT } from "@/helpers/api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AxiosError } from "axios";

import "@/helpers/urls";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

import SubsysMenu from "@/components/ViewReportComponents/SubsystemMenu";
import TeamMenu, { Team } from "@/components/ViewReportComponents/TeamMenu";
import URLS from "@/helpers/urls";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";

dayjs.extend(utc);
dayjs.extend(timezone);

const steps = ["Record Entry", "Analysis", "Review"];

interface IFormInputs {
  title: string;
  description: string;
  subsystem_name: string;
  impact: string;
  cause: string;
  mechanism: string;
  corrective_action_plan: string;
  car_year: number;
  team_id: number;
  time_of_failure: string;
}

interface Subsystem {
  id: string;
  name: string;
}

interface CurrentUser {
  id: string;
  team_id: number;
}

const defaultYear = dayjs(new Date());
const time_of_failure = dayjs(new Date());


const schema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().min(5).required(),
  subsystem_name: yup.string(),
  time_of_failure: yup
    .string()
    .default(time_of_failure.toString())
    .required(),
  impact: yup.string(),
  cause: yup.string(),
  mechanism: yup.string(),
  corrective_action_plan: yup.string(),
  car_year: yup
    .string()
    .default(defaultYear.toString())
    .required(),
  team_id: yup.number(),
});

export type UserForm = yup.InferType<typeof schema>;

interface Props {
  report_id?: number; // if no report_id given, assume we are creating a new report
}

const ReportForm: React.FC = (props: Props) => {
  const { report_id } = props;

  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [subsystems, setSubsystems] = useState([]);
  const [helperTextLinkClicked, setHelperTextLinkClicked] = useState(false);
  const [isTextFieldOpen, setIsTextFieldOpen] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const [teams, setTeams] = useState<Team[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(); // State to keep track of selected team ID

  const handleNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSnackbarOpen = () => {
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  // Callback function to update the selected team ID
  const handleSelectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<UserForm>({
    resolver: yupResolver(schema),
  });

  const onValid: SubmitHandler<UserForm> = (data, event) => {
    if (submitted) return;
    setSubmitted(true);
    //  Not efficient, but I cannot find out how to override the default date format, since react-hook-form abstracts away the string conversion so we can't use .format().
    data.time_of_failure = dayjs(data.time_of_failure).format(API_DATE_FORMAT);
    data.car_year = dayjs(data.car_year).year().toString();
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
  //console.log(watch('email'));
  //console.log('errors are', errors);

  const fetchTeam = () => {
    API_CLIENT.get(API_ENDPOINT.TEAM)
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
  };

  const fetchCurrentUser = () => {
    API_CLIENT.get(API_ENDPOINT.USER + `/current`)
      .then((response) => {
        if (response.status == 200) {
          setCurrentUser(response.data);
          // setValue("subsystem_name", response.data.team_id, {
          //   shouldValidate: true,
          // });
          reset({
            team_id: response.data.team_id,
          });
        } else {
          setSnackbarMessage(response.data.message);
          setSnackbarSeverity("error");
          handleSnackbarOpen();
        }
      })
      .catch((error: AxiosError) => {
        setSnackbarMessage(error.message);
        setSnackbarSeverity("error");
        handleSnackbarOpen();
      });
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchTeam();
    setLoading(false);
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
          <form onSubmit={handleSubmit(onValid)}>
            {(activeStep === 0 || activeStep === 2) && (
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
                    <TeamMenu<UserForm>
                      control={control}
                      teams={teams}
                      label="Team"
                      name="team_id"
                      id="team"
                    />
                  </Grid>
                  <Grid xs={3}>
                    <Controller
                      name="subsystem_name"
                      defaultValue={""}
                      control={control}
                      render={({ field }) => (
                        <SubsysMenu<UserForm>
                          team_id={watch("team_id")}
                          field={field}
                          label="Subsystem"
                        />
                      )}
                    />
                  </Grid>
                  <Divider orientation="vertical" flexItem></Divider>
                  <Grid xs={2}>
                    <Controller
                      name="car_year"
                      control={control}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                          {...field}
                          label="Car Year"
                          defaultValue={defaultYear}
                          views={['year']}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Grid>
                  <Grid xs={3}>
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
                          <DateTimePicker
                            //format="YYYY-MM-DD[T]HH:mm"
                            {...field}
                            defaultValue={time_of_failure}
                            label="Time of Failure"
                            // error={!!errors.title}
                            timezone={process.env.TZ}
                            disableFuture={true} // time travellers beware...
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
                <Button type="submit">Submit</Button>
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
