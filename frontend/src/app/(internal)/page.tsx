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

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Paper, Grid, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

import {
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  Label,
  LabelList,
} from "recharts";
import { API_CLIENT, API_TYPES, API_ENDPOINT } from "@/helpers/api";
import { AxiosResponse, AxiosError } from "axios";

interface UserReports {
  id: number;
  created_at: string;
  title: string;
  creator: string;
  status: string;
}

interface PieChart {
  name: string;
  value: number;
}

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ownedReports, setOwnedReports] = useState<UserReports[]>([]);
  const [pieChartData, setPieChartData] = useState<PieChart[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await API_CLIENT.get<
          API_TYPES.REPORT.GET.REQUEST,
          AxiosResponse<API_TYPES.REPORT.GET.RESPONSE[]>
        >(API_ENDPOINT.RECORD, { params: { filter_owner: true } })
          .then((response) => {
            if (response) {
              console.log(response.data);
              setOwnedReports(
                response.data
                  .map((report) => {
                    // TODO: INCORPORATE REPORT VALIDATION STATUS INSTEAD OF DISPLAYING CONSTANT "Open"
                    return {
                      id: report.id,
                      created_at: report.created_at || "",
                      title: report.title || "",
                      creator: report.creator.email || "",
                      status: "Open",
                    };
                  })
                  .reverse()
              );
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

    (async () => {
      try {
        const response = await API_CLIENT.get<
          API_TYPES.NULLREQUEST_,
          AxiosResponse<API_TYPES.REPORT.STATS.GET.RESPONSE[]>
        >(API_ENDPOINT.RECORD_STATS, {})
          .then((response) => {
            if (response) {
              console.log(response.data);
              setPieChartData(
                response.data.map((cat) => {
                  return {
                    name: cat.team_name || "Uncategorized",
                    value: cat.open_reports,
                  };
                })
              );
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

  const upcomingTasks = [
    {
      id: 1,
      reportName: "Report 1",
      assigner: "John Doe",
      dueDate: "2023-08-24",
      view: "/viewreport",
    },
    {
      id: 2,
      reportName: "Report 2",
      assigner: "Jane Smith",
      dueDate: "2023-08-28",
      view: "/viewreport",
    },
    {
      id: 3,
      reportName: "Report 3",
      assigner: "John Doe",
      dueDate: "2023-08-29",
      view: "/viewreport",
    },
    {
      id: 4,
      reportName: "Report 4",
      assigner: "John Doe",
      dueDate: "2023-08-29",
      view: "/viewreport",
    },
    {
      id: 5,
      reportName: "Report 5",
      assigner: "John Doe",
      dueDate: "2023-08-29",
      view: "/viewreport",
    },
  ];

  const taskColumns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "reportName", headerName: "Report Name", width: 220 },
    { field: "assigner", headerName: "Assigner", width: 160 },
    { field: "dueDate", headerName: "Due Date", width: 170 },
    {
      field: "view",
      headerName: "View",
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" aria-label="View" href="/viewreport">
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  const reportColumns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "created_at", headerName: "Creation Date", width: 170 },
    { field: "title", headerName: "Report name", width: 350 },
    { field: "car_year", headerName: "Car year", width: 100 },
    { field: "creator", headerName: "Creator name", width: 130 },
    { field: "status", headerName: "Status", width: 100 },
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" aria-label="Edit" href="/editreport">
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "view",
      headerName: "View",
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" aria-label="View" href="/viewreport">
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  const filteredReports = ownedReports.filter((report) =>
    Object.values(report).some((value) =>
      value
        ? value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        : false
    )
  );

  const pieChartColors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF73FA",
  ];

  return (
    <div style={{ display: "flex" }}>
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          p: 1,
          marginTop: "0px",
          marginLeft: "0px",
          marginRight: "0px",
        }}
      >
        <Grid container spacing={4} rowSpacing={1}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                margin: 0,
                boxShadow: 5,
                border: "1px solid lightblue",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: 16 }}
                color={"white"}
              >
                Open Reports By Team
              </Typography>
              <PieChart width={300} height={250}>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieChartColors[index % pieChartColors.length]}
                    />
                  ))}
                  <LabelList dataKey="value" position="inside" fill="#fff" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Paper>
          </Grid>

          {/* Bookmarked Tasks DataGrid */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: 5,
                border: "1px solid lightblue",
              }}
            >
              <Typography variant="subtitle1" color={"white"}>
                You have{" "}
                <span style={{ color: "red" }}>{upcomingTasks.length}</span>{" "}
                bookmarked tasks
              </Typography>
              <div style={{ height: 237, width: "100%", marginTop: 16 }}>
                <DataGrid
                  rows={upcomingTasks}
                  columns={taskColumns}
                  props
                  hideFooter={true}
                />
              </div>
            </Paper>
          </Grid>

          {/* Recent Reports DataGrid */}
          <Grid item xs={12} md={12}>
            <Paper
              sx={{
                p: 2,
                marginTop: 3,
                boxShadow: 5,
                border: "1px solid lightblue",
              }}
            >
              <Typography variant="h5" color="primary" gutterBottom>
                Your Reports
              </Typography>
              <div style={{ height: 75, width: "100%", marginTop: 16 }}>
                <TextField
                  label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
              </div>
              <DataGrid rows={filteredReports} columns={reportColumns} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
