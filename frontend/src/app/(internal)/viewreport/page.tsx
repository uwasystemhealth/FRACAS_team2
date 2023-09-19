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

import React, { FC, useState } from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import '@/components/styles/viewreport.css';

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
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <Card style={{padding:10}}>
    <Card style={{padding:10}}>
      <Button className="statusButton" size="small">
        Pending Review
      </Button>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h5" className="title" style={{ fontWeight: 'bold' }}>
            LV PDM Buck Converter Failure
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="flex-end">
        <Button
          className="bookmarkButton"
          size="small"
          onClick={toggleBookmark}
        >
          {isBookmarked ? (
            <BookmarkAddedIcon className="bookmarkIcon" />
          ) : (
            <BookmarkAddIcon className="bookmarkIcon" />
          )}
        </Button>
          <Button className="editButton" size="small" href="/editreport">
            <div className="buttonContent">
              <EditIcon className="editIcon" />
              Edit Report
            </div>
          </Button>
        </Grid>
      </Grid>
      <Divider variant="fullWidth" style={{ margin: '1rem 0', borderColor: 'lightblue'}} />
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body2">
            <b>Date Created:</b> 25/07/15
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body2">
            <b>Team:</b> Electrical
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body2">
            <b>Subsystem:</b> PDM
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body2">
            <b>Car Year:</b> 2022
          </Typography>
        </Grid>
      </Grid>
      <Divider variant="fullWidth" style={{ margin: '1rem 0', borderColor: 'lightblue' }} />
        <Typography variant="subtitle1" className="sectionTitle" style={{ fontWeight: 'bold', color:"white" }}>
          Description:
        </Typography>
        <Typography variant="body1" className="sectionText">
          The LV PDM buck converter on '22 (Flo) failed whilst driving.
        </Typography>
        <Grid container justifyContent="flex-end" spacing = {1}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            checked={isChecked1}
            onChange={() => setIsChecked1(!isChecked1)}
          />
        </Grid>
        <Divider variant="fullWidth" style={{ margin: '1rem 0', borderColor: 'lightblue' }} />
        <Typography variant="subtitle1" className="sectionTitle" style={{ fontWeight: 'bold', color:"white" }}>
          Impact:
        </Typography>
        <Typography variant="body1" className="sectionText">
          The pump for cooling the motor lost power, cannot test drive the car
          until fixed. Delaying vehicle testing and driver training. Lengthy
          troubleshooting / repair is diverting time from designing and
          manufacturing the 2023 car.
        </Typography>
        <Typography variant="subtitle1" className="sectionTitle" style={{ fontWeight: 'bold', color:"white" }}>
          Cause:
        </Typography>
        <Typography variant="body1" className="sectionText">
          Overheating of the inductor due to high current.
        </Typography>
        <Typography variant="subtitle1" className="sectionTitle" style={{ fontWeight: 'bold', color:"white" }}>
          Mechanism:
        </Typography>
        <Typography variant="body1" className="sectionText">
          Dielectric Breakdown.
        </Typography>
        <Grid container justifyContent="flex-end" spacing = {1}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            checked={isChecked2}
            onChange={() => setIsChecked2(!isChecked2)}
          />
        </Grid>
        <Divider variant="fullWidth" style={{ margin: '1rem 0', borderColor: 'lightblue' }} />
        <Typography variant="subtitle1" className="sectionTitle" style={{ fontWeight: 'bold', color:"white" }}>
          Corrective Action Plan:
        </Typography>
        <Typography variant="body1" className="sectionText">
          Replace broken inductor with a new lower-resistance inductor and
          validate reduced operating temperature with bench testing under expected
          load.
        </Typography>
        <Grid container justifyContent="flex-end" spacing = {1}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            checked={isChecked3}
            onChange={() => setIsChecked3(!isChecked3)}
          />
        </Grid>
      </Card>
      <Divider variant="fullWidth" style={{ margin: '1rem 0', borderColor: 'lightblue' }} />
      <Card className="infoCard">
        <CardContent>
          <Typography variant="h6" className="sectionTitle" style={{ fontWeight: 'bold', color:"white" }}>
            Additional Information
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Typography variant="body2">
                <b>Created By:</b> Erwin Bauernschmitt
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">
                <b>Owned By:</b> Erwin Bauernschmitt
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">
                <b>Time of Failure:</b> 14:30 08/09/2023
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">
                <b>Time Resolved:</b> e.g. [Pending | 14:30 08/09/2023]
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">
                <b>Creator Contact:</b> 22964301@student.uwa.edu.au
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">
                <b>Owner Contact:</b> 22964301@student.uwa.edu.au
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">
                <b>Report Team Lead:</b> Nathan Mayhew
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">
                <b>Report Team Lead Contact:</b> 23065159@student.uwa.edu.au
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Card>
  );
}