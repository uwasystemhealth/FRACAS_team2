"use client";
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
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

interface ReportFields {
  failure_title: "Example Failure Record";
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

export default function ViewReport() {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h3" gutterBottom>
        LV PDM Buck Converter Failure
      </Typography>
      <Card sx={{ minWidth: 275, my: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                <b>Date Created:</b> 25/07/15
              </Typography>
            </Grid>
            <Grid xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                <b>Created By:</b> Erwin Bauernschmitt
              </Typography>
            </Grid>
            <Grid xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                <b>Owned By:</b> Erwin Bauernschmitt
              </Typography>
            </Grid>
            <Grid xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                <b>Team:</b> Electrical
              </Typography>
            </Grid>
            <Grid xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                <b>Subsystem:</b> PDM
              </Typography>
            </Grid>
            <Grid xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                <b>Car Year:</b> 2022
              </Typography>
            </Grid>
            <Grid xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                <b>Time of Failure:</b> 14:30 08/09/2023
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button size="small" href="/editreport">
            Edit Report
          </Button>
        </CardActions>
      </Card>
      <Typography variant="h4" gutterBottom>
        Description
      </Typography>
      <Typography variant="body1" gutterBottom>
        The LV PDM buck converter on '22 (Flo) failed whilst driving.
      </Typography>
      <Divider sx={{ mx: 2, my: 3 }} />
      <Typography variant="h4" gutterBottom>
        Impact
      </Typography>
      <Typography variant="body1" gutterBottom>
        The pump for cooling the motor lost power, cannot test drive the car
        until fixed. Delaying vehicle tesing and driver training. Lengthy
        troubleshooting / repair is diverting time from designing and
        manufacturing the 2023 car.
      </Typography>
      <Divider sx={{ mx: 2, my: 3 }} />
      <Typography variant="h5" gutterBottom>
        Cause
      </Typography>
      <Typography variant="body1" gutterBottom>
        Overheating of the inductor due to high current.
      </Typography>
      <Typography variant="h5" gutterBottom>
        Mechanism
      </Typography>
      <Typography variant="body1" gutterBottom>
        Dielectric Breakdown.
      </Typography>
      <Typography variant="h5" gutterBottom>
        Corrective Action Plan
      </Typography>
      <Typography variant="body1" gutterBottom>
        Replace broken inductor with a new lower-resistance inductor and
        validate reduced operating temperature with bench testing under expected
        load.
      </Typography>
      <Card sx={{ minWidth: 275, my: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Additional Info:
          </Typography>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                <b>Creator Contact:</b> 22964301@student.uwa.edu.au
              </Typography>
            </Grid>
            <Grid xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                <b>Owner Contact:</b> 22964301@student.uwa.edu.au
              </Typography>
            </Grid>
            <Grid xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                <b>Report Team Lead:</b> Nathan Mayhew
              </Typography>
            </Grid>
            <Grid xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                <b>Report Team Lead Contact:</b> 23065159@student.uwa.edu.au
              </Typography>
            </Grid>
            <Grid xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                <b>Validation Status:</b> e.g. [Record, Analysis Validated |
                Fully Validated]
              </Typography>
            </Grid>
            <Grid xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                <b>Report Status:</b> e.g. [Draft | In Progress | Pending Review
                | Resolved]
              </Typography>
            </Grid>
            <Grid xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                <b>Time Resolved:</b> e.g. [Pending | 14:30 08/09/2023]
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
