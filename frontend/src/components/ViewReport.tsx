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

import React, { FC, useState, useEffect, useContext } from "react";
import { Box } from "@mui/material";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import GradingIcon from "@mui/icons-material/Grading";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import BuildIcon from "@mui/icons-material/Build";
import Alert from "@mui/material/Alert";
import "@/components/styles/viewreport.css";
import { API_CLIENT, API_ENDPOINT, API_TYPES } from "@/helpers/api";
import { AxiosError, AxiosResponse } from "axios";
import ReportStatusMessage from "@/components/ReportStatusMessage";


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

  // PRINT HACK
  // PRINT HACK
  // PRINT HACK
  // (Reasons from https://github.com/uwasystemhealth/fracas_team2/issues/53)
  // This works but with compromises to force the print to export in light mode
  // (for printing)
  // * I have to force it to spawn the page in a popup, since dynamically changing
  // the style has a lot of issues since 1) the print event handlers work
  // differently on different browsers (chromium and firefox have different
  // concepts of when the print ends) causing inconsistent results when printing
  // through window.print() vs CTRL+P 2) dynamically changing the style causes
  // some elements such as text to not be changed, only the background,
  // resulting in poor contrast, and this is dependent on the previous point.
  // * This also adds a rudimentary light mode, using ?light=1.
  // * If you use ?print=1, the page will automatically print on load. This is
  // what is being used for the popups

  const [printDialogSpawned, setPrintDialogSpawned] = useState(false);

  // You may want to use this variable in the future to hide the elements fully
  // if ?print=1, for example if I want to export the page as HTML instead of a
  // PDF.
  const [printOnLoad, setPrintOnLoad] = useState(false);

  const printHack = () => {
    // Open the page in a popup window
    const next_url = new URL(window.location.href);
    next_url.searchParams.set("print", "1");
    next_url.searchParams.set("light", "1");
    const popup = window.open(
      next_url.toString(),
      "_blank",
      "width=960,height=1080"
    );
  };

  const overrideCtrlP = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "p") {
      event.preventDefault();
      printHack();
    }
  };

  const overridePrintDialog = (e) => {
    e.preventDefault();
    printHack();
  };

  useEffect(() => {
    document.addEventListener("keydown", overrideCtrlP);

    if (typeof window === "object") {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      if ((params.get("print") || "0") === "1") {
        setPrintOnLoad(true);
      } else {
        window.print = printHack;
      }
    }

    return () => {
      document.removeEventListener("keydown", overrideCtrlP);
    };
  }, []);

  useEffect(() => {
    if (!printOnLoad) {
      window.addEventListener("beforeprint", overridePrintDialog);
    } else {
      window.removeEventListener("beforeprint", overridePrintDialog);
    }

    return () => window.removeEventListener("beforeprint", overridePrintDialog);
  }, [printOnLoad]);

  // CHECK IF PRINT PARAMETER IS PASSED - IF SO, OPEN THE PRINT DIALOG
  useEffect(() => {
    if (!loading && !printDialogSpawned && printOnLoad) {
      setPrintDialogSpawned(true);
      window.print();
      window.close();
    }
  }, [loading, printOnLoad, printDialogSpawned]);
  // END PRINT HACK
  // END PRINT HACK
  // END PRINT HACK

  const fetchData = async () => {
    try {
      await API_CLIENT.get<
        API_TYPES.NULLREQUEST_,
        AxiosResponse<API_TYPES.REPORT.GET.RESPONSE>
      >(API_ENDPOINT.RECORD + `/${id}`)
        .then((response) => {
          setReport(response.data);
          document.title = response.data?.title || `Untitled report ${id}`;
          setLoading(false);
        })
        .catch((error: AxiosError<API_TYPES.USER.RESPONSE>) => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
    try {
      await API_CLIENT.get(API_ENDPOINT.BOOKMARK + `/${id}`)
        .then((response) => {
          if (response.data == true) {
            setIsBookmarked(true)
          } else {
            setIsBookmarked(false)
          }
        })
        .catch((error: AxiosError<API_TYPES.USER.RESPONSE>) => {
        });
    } catch (error) {
    }
  };

  const toggleBookmark = async () => {
    try {
      await API_CLIENT.post(API_ENDPOINT.BOOKMARK + `/${id}`)
        .then((response) => {
          if (response.status == 200) {
            if (response.data == true) {
              setIsBookmarked(true)
            } else {
              setIsBookmarked(false)
            }
          } else {
            console.error("Bookmark Failed!")
          }
        })
        .catch((error: AxiosError<API_TYPES.USER.RESPONSE>) => {
        });
    } catch (error) {
    }
  };

  // Runs fetchData() when page is initally loaded
  useEffect(() => {
    fetchData();
  }, []);

  const stringToDateTime = (input_date?: string) => {
    const date = input_date ? new Date(input_date) : new Date(0);
    return date.toLocaleString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stringToDate = (input_date?: string) => {
    const date = input_date ? new Date(input_date) : new Date(0);
    return date.toLocaleString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const validationSection = (status: boolean, type: string) => {
    var icon = <GradingIcon fontSize="inherit" />;
    if (type == "Record") {
      icon = <GradingIcon fontSize="inherit" />;
    } else if (type == "Analysis") {
      icon = <TroubleshootIcon fontSize="inherit" />;
    } else if (type == "Corrective Action") {
      icon = <BuildIcon fontSize="inherit" />;
    }
    if (status) {
      return (
        <Alert icon={icon} color="success">
          {type} Validated
        </Alert>
      );
    } else {
      return (
        <Alert icon={icon} color="warning">
          {type} Validation Pending
        </Alert>
      );
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <ReportStatusMessage status={report?.stage} messageOnly={true}/>
      <Grid container rowSpacing={2} >
        <Grid xs={12} md={6}>
          <Typography
            variant="h5"
            className="title"
            style={{ fontWeight: "bold" }}
          >
            {report?.title}
          </Typography>
        </Grid>
        <Grid
          xs={12}
          md={6}
          direction="row"
          container
          justifyContent={{xs: "normal", md: "flex-end"}}
          sx={{ displayPrint: "none", gap: 1 }}
        >
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
            className="printButton"
            size="small"
            onClick={() => {
              printHack();
            }}
          >
            <PrintIcon />
          </Button>
          <Button
            className="editButton"
            size="small"
            href={`/editreport/${report?.id}`}
            variant="text"
          >
            <EditIcon className="editIcon" />
            Update
          </Button>
        </Grid>
      </Grid>
      <Divider
        variant="fullWidth"
        style={{ margin: "1rem 0", borderColor: "lightblue" }}
      />
      <Grid container spacing={2}>
        <Grid xs={6} md={3}>
          <Typography variant="body2">
            <b>Date Created:</b> {stringToDateTime(report?.created_at || "?")}
          </Typography>
        </Grid>
        <Grid xs={6} md={3}>
          <Typography variant="body2">
            <b>Team:</b> {report?.team?.name}
          </Typography>
        </Grid>
        <Grid xs={6} md={3}>
          <Typography variant="body2">
            <b>Subsystem:</b> {report?.subsystem?.name}
          </Typography>
        </Grid>
        <Grid xs={6} md={3}>
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
        variant="body1"
        className="sectionTitle"
        style={{ fontWeight: "bold" }}
      >
        Description:
      </Typography>
      <Typography variant="body1" className="sectionText">
        {report?.description}
      </Typography>
      {validationSection(report?.record_valid || false, "Record")}
      <Divider
        variant="fullWidth"
        style={{ margin: "1rem 0", borderColor: "lightblue" }}
      />
      <Typography
        variant="body1"
        className="sectionTitle"
        style={{ fontWeight: "bold" }}
      >
        Impact:
      </Typography>
      <Typography variant="body1" className="sectionText">
        {report?.impact}
      </Typography>
      <Typography
        variant="body1"
        className="sectionTitle"
        style={{ fontWeight: "bold" }}
      >
        Cause:
      </Typography>
      <Typography variant="body1" className="sectionText">
        {report?.cause}
      </Typography>
      <Typography
        variant="body1"
        className="sectionTitle"
        style={{ fontWeight: "bold" }}
      >
        Mechanism:
      </Typography>
      <Typography variant="body1" className="sectionText">
        {report?.mechanism}
      </Typography>
      {validationSection(report?.analysis_valid || false, "Analysis")}
      <Divider
        variant="fullWidth"
        style={{ margin: "1rem 0", borderColor: "lightblue" }}
      />
      <Typography
        variant="body1"
        className="sectionTitle"
        style={{ fontWeight: "bold" }}
      >
        Corrective Action Plan:
      </Typography>
      <Typography variant="body1" className="sectionText">
        {report?.corrective_action_plan}
      </Typography>
      {validationSection(
        report?.corrective_valid || false,
        "Corrective Action"
      )}
      <Divider
        variant="fullWidth"
        style={{ margin: "1rem 0", borderColor: "lightblue" }}
      />
      
      <Card className="infoCard">
        <CardContent>
          <Grid container spacing={1}>
            <Grid xs={6} md={3}>
              <Typography variant="body2">
                <b>Created By:</b> {report?.creator.name}
              </Typography>
            </Grid>
            <Grid xs={6} md={3}>
              <Typography variant="body2">
                <b>Owned By:</b> {report?.owner?.name}
              </Typography>
            </Grid>
            <Grid xs={6} md={3}>
              <Typography variant="body2">
                <b>Report Team Lead:</b> {report?.team?.leader?.name}
              </Typography>
            </Grid>
            <Grid xs={6} md={3}>
              <Typography variant="body2">
                <b>Time of Failure:</b> {stringToDateTime(report?.time_of_failure || "?")}
              </Typography>
            </Grid>
            <Grid xs={6} md={3}>
              <Typography variant="body2">
                <b>Creator Contact:</b> {report?.creator.email}
              </Typography>
            </Grid>
            <Grid xs={6} md={3}>
              <Typography variant="body2">
                <b>Owner Contact:</b> {report?.owner?.email}
              </Typography>
            </Grid>
            <Grid xs={6} md={3}>
              <Typography variant="body2">
                <b>Report Team Lead Contact:</b> {report?.team?.leader?.email}
              </Typography>
            </Grid>
            <Grid xs={6} md={3}>
              <Typography variant="body2">
              <b>Date Resolved:</b> {stringToDate(report?.time_resolved || "Pending")}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
export default viewReport;
