"use client";

/*
 * Better FRACAS
 * Copyright (C) 2023  PETER TANNER, ??? Better Fracas team
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

import React, { FC, useState, useEffect } from "react";
import { Box } from "@mui/material";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import EditIcon from "@mui/icons-material/Edit";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import "@/components/styles/viewreport.css";
import { API_CLIENT, API_ENDPOINT, API_TYPES } from "@/helpers/api";
import { AxiosError, AxiosResponse } from "axios";

interface ViewReportProps {
  id: number;
}

const viewReport: React.FC<ViewReportProps> = ({ id }) => {
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<API_TYPES.REPORT.GET.RESPONSE>();
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const fetchData = async () => {
    try {
      await API_CLIENT.get<
        API_TYPES.NULLREQUEST_,
        AxiosResponse<API_TYPES.REPORT.GET.RESPONSE>
      >(API_ENDPOINT.RECORD + `/${id}`)
        .then((response) => {
          setReport(response.data);
          console.log(response.data);
          setLoading(false);
        })
        .catch((error: AxiosError<API_TYPES.USER.RESPONSE>) => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
  };

  // Runs fetchData() when page is initally loaded
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Button className="statusButton" size="small">
        Pending Review
      </Button>
      <Grid container alignItems="center">
        <Grid xs={6}>
          <Typography
            variant="h5"
            className="title"
            style={{ fontWeight: "bold" }}
          >
            {report?.title}
          </Typography>
        </Grid>
        <Grid xs={6} container justifyContent="flex-end">
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
          <Button
            className="editButton"
            size="small"
            href={`/editreport/${report?.id}`}
          >
            <EditIcon className="editIcon" />
            Edit Report
          </Button>
        </Grid>
      </Grid>
      <Divider
        variant="fullWidth"
        style={{ margin: "1rem 0", borderColor: "lightblue" }}
      />
      <Grid container spacing={2}>
        <Grid xs={3}>
          <Typography variant="body2">
            <b>Date Created:</b> {report?.created_at}
          </Typography>
        </Grid>
        <Grid xs={3}>
          <Typography variant="body2">
            <b>Team:</b> {report?.team?.name}
          </Typography>
        </Grid>
        <Grid xs={3}>
          <Typography variant="body2">
            <b>Subsystem:</b> {report?.subsystem?.name}
          </Typography>
        </Grid>
        <Grid xs={3}>
          <Typography variant="body2">
            <b>Car Year:</b> {report?.car_year}
          </Typography>
        </Grid>
      </Grid>
      <Divider
        variant="fullWidth"
        style={{ margin: "1rem 0", borderColor: "lightblue" }}
      />
      <Typography
        variant="subtitle1"
        className="sectionTitle"
        style={{ fontWeight: "bold" }}
      >
        Description:
      </Typography>
      <Typography variant="body1" className="sectionText">
        {report?.description}
      </Typography>
      <Grid container justifyContent="flex-end" spacing={1}>
        <Checkbox
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          checked={isChecked1}
          onChange={() => setIsChecked1(!isChecked1)}
        />
      </Grid>
      <Divider
        variant="fullWidth"
        style={{ margin: "1rem 0", borderColor: "lightblue" }}
      />
      <Typography
        variant="subtitle1"
        className="sectionTitle"
        style={{ fontWeight: "bold" }}
      >
        Impact:
      </Typography>
      <Typography variant="body1" className="sectionText">
        {report?.impact}
      </Typography>
      <Typography
        variant="subtitle1"
        className="sectionTitle"
        style={{ fontWeight: "bold" }}
      >
        Cause:
      </Typography>
      <Typography variant="body1" className="sectionText">
        {report?.cause}
      </Typography>
      <Typography
        variant="subtitle1"
        className="sectionTitle"
        style={{ fontWeight: "bold" }}
      >
        Mechanism:
      </Typography>
      <Typography variant="body1" className="sectionText">
        {report?.mechanism}
      </Typography>
      <Grid container justifyContent="flex-end" spacing={1}>
        <Checkbox
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          checked={isChecked2}
          onChange={() => setIsChecked2(!isChecked2)}
        />
      </Grid>
      <Divider
        variant="fullWidth"
        style={{ margin: "1rem 0", borderColor: "lightblue" }}
      />
      <Typography
        variant="subtitle1"
        className="sectionTitle"
        style={{ fontWeight: "bold" }}
      >
        Corrective Action Plan:
      </Typography>
      <Typography variant="body1" className="sectionText">
        {report?.corrective_action_plan}
      </Typography>
      <Grid container justifyContent="flex-end" spacing={1}>
        <Checkbox
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          checked={isChecked3}
          onChange={() => setIsChecked3(!isChecked3)}
        />
      </Grid>
      <Divider
        variant="fullWidth"
        style={{ margin: "1rem 0", borderColor: "lightblue" }}
      />
      <Card className="infoCard">
        <CardContent>
          <Typography variant="h6" className="sectionTitle">
            Additional Information
          </Typography>
          <Grid container spacing={1}>
            <Grid xs={3}>
              <Typography variant="body2">
                <b>Created By:</b> {report?.creator.name}
              </Typography>
            </Grid>
            <Grid xs={3}>
              <Typography variant="body2">
                <b>Owned By:</b> {report?.owner?.name}
              </Typography>
            </Grid>
            <Grid xs={3}>
              <Typography variant="body2">
                <b>Report Team Lead:</b> {report?.team?.leader?.name}
              </Typography>
            </Grid>
            <Grid xs={3}>
              <Typography variant="body2">
                <b>Time of Failure:</b> {report?.time_of_failure}
              </Typography>
            </Grid>
            <Grid xs={3}>
              <Typography variant="body2">
                <b>Creator Contact:</b> {report?.creator.email}
              </Typography>
            </Grid>
            <Grid xs={3}>
              <Typography variant="body2">
                <b>Owner Contact:</b> {report?.owner?.email}
              </Typography>
            </Grid>
            <Grid xs={3}>
              <Typography variant="body2">
                <b>Report Team Lead Contact:</b> {report?.team?.leader?.email}
              </Typography>
            </Grid>
            <Grid xs={3}>
              <Typography variant="body2">
                {/* TODO:  */}
                <b>Time Resolved:</b> Yet to be resolved
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
export default viewReport;
