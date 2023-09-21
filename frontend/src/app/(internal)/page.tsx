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
import {
  AppBar,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Grid,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { API_CLIENT, API_ENDPOINT, API_TYPES } from "@/helpers/api";
import { AxiosError, AxiosResponse } from "axios";
import { title } from "process";
import LocalizedDate from "@/components/LocalizedDate";

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
  // TODO: implement functionality for learning tasks
  const upcomingTasks = [
    {
      id: 1,
      reportName: "Report 1",
      assigner: "John Doe",
      dueDate: "2023-08-24",
    },
    {
      id: 2,
      reportName: "Report 2",
      assigner: "Jane Smith",
      dueDate: "2023-08-28",
    },
    {
      id: 3,
      reportName: "Report 3",
      assigner: "John Doe",
      dueDate: "2023-08-29",
    },
  ];

  // YOUR REPORTS LOGIC
  const [userReports, setUserReports] = useState<UserReports[]>([]);
  const [pieChartData, setPieChartData] = useState<PieChart[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await API_CLIENT.get<
          API_TYPES.REPORT.GET.REQUEST,
          AxiosResponse<API_TYPES.REPORT.GET.RESPONSE[]>
        >(API_ENDPOINT.RECORD, { params: { user_only: true } })
          .then((response) => {
            if (response) {
              console.log(response.data);
              setUserReports(
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
  // const recentReports = [
  //   {
  //     id: 1,
  //     dateCreated: "2023-08-25",
  //     title: "Report 1",
  //     creator: "John Doe",
  //     status: "Open",
  //   },
  //   {
  //     id: 2,
  //     dateCreated: "2023-08-24",
  //     title: "Report 2",
  //     creator: "Jane Smith",
  //     status: "Draft",
  //   },
  // ];
  // END YOUR REPORTS LOGIC

  const upcomingTasksCount = upcomingTasks.length;
  const pieChartColors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF73FA",
  ];

  // const pieChartData = [
  //   { name: "Electrical", value: 30 },
  //   { name: "Subsytem", value: 45 },
  //   { name: "Mechanical", value: 20 },
  //   // Add more sample data...
  // ];

  return (
    <div style={{ display: "flex" }}>
      {/* Main Content */}
      <Container component="main" sx={{ flexGrow: 1, p: 3, marginTop: "64px" }}>
        {/* Layout using Grid */}
        <Grid container spacing={2}>
          {/* Bar Graph */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: 16 }}>
                Failure Reports by Team
              </Typography>
              <BarChart width={250} height={250} data={pieChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: 16 }}>
                Resolution Rate
              </Typography>
              <PieChart width={250} height={250}>
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
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Paper>
          </Grid>

          {/* Upcoming Tasks Tile */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="subtitle1">
                You have {upcomingTasksCount} upcoming tasks
              </Typography>
              <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                  <TableBody>
                    {upcomingTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell sx={{ fontSize: 12 }}>
                          {task.reportName}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12 }}>
                          {task.assigner}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: "red" }}>
                          {task.dueDate}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Recent Reports Table */}
          <Grid item xs={12} md={12}>
            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="h5" color="primary" gutterBottom>
                        Your Reports
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Date Created</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Creator</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <LocalizedDate date_string={report.created_at} />
                      </TableCell>
                      <TableCell>{report.title}</TableCell>
                      <TableCell>{report.creator}</TableCell>
                      <TableCell>{report.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
