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

import React, { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import {Container,Paper,Grid, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

import {
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  Label,
  LabelList,
} from "recharts";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const upcomingTasks = [
    {
      id: 1,
      reportName: "Report 1",
      date: "2023-08-24",
      status: "Open",
      view: "/viewreport",
    },
    {
      id: 2,
      reportName: "Report 2",
      date: "2023-08-28",
      status: "Open",
      view: "/viewreport",
    },
    {
      id: 3,
      reportName: "Report 3",
      date: "2023-08-29",
      status: "Open",
      view: "/viewreport",
    },
    {
      id: 4,
      reportName: "Report 4",
      date: "2023-08-29",
      status: "Open",
      view: "/viewreport",
    },
    {
      id: 5,
      reportName: "Report 5",
      date: "2023-08-29",
      status: "Open",
      view: "/viewreport",
    }
  ];

  const taskColumns = [
    {field: "id", headerName: "ID", width: 80},
    {field: "reportName", headerName: "Report Name", flex: 1},
    {field: "date", headerName: "Date Created", flex: 1},
    {field: "status", headerName: "Status", width: 120},
    {
      field: "view",
      headerName: "View",
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" aria-label="View" href = "/viewreport">
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  const reportColumns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "date", headerName: "Creation Date", width: 170 },
    { field: "ReportName", headerName: "Report name", width: 350 },
    { field: "carYear", headerName: "Car year", width: 100 },
    { field: "creatorName", headerName: "Creator name", width: 130 },
    { field: "status", headerName: "Status", width: 100 },
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" aria-label="Edit" href = '/editreport'>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "view",
      headerName: "View",
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" aria-label="View" href = "/viewreport">
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  const recentReports = [
    {
      id: 1,
      date: "27/08/2023",
      ReportName: "Report 1",
      carYear: 2023,
      creatorName: "Kyle",
      status: "Open",
      edit: "/editreport",
      view: "/viewreport",
    },
    {
      id: 2,
      date: "27/08/2023",
      ReportName: "Report 2",
      carYear: 2023,
      creatorName: "Kyle",
      status: "Open",
    },
    {
      id: 3,
      date: "27/08/2023",
      ReportName: "Report 3",
      carYear: 2022,
      creatorName: "Kyle",
      status: "Open",
    },
    {
      id: 4,
      date: "27/08/2023",
      ReportName: "Report 4",
      carYear: 2023,
      creatorName: "Kyle",
      status: "Open",
    },
  ];

  const filteredReports = recentReports.filter((report) =>
  Object.values(report).some((value) =>
    value ? value.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false
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

  const sampleData = [
    { name: "Electrical", value: 30 },
    { name: "Subsytem", value: 45 },
    { name: "Mechanical", value: 20 },
    // Add more sample data...
  ];

  return (
    <div style={{ display: "flex" }}>
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, p: 1, marginTop: "0px", marginLeft: "0px", marginRight: "0px" }}>
        <Grid container spacing={4} rowSpacing={1}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, margin:0, boxShadow: 5, border: "1px solid lightblue" }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: 16 }} color={"white"}>
                Open Reports By Team
              </Typography>
              <PieChart width={300} height={250}>
                <Pie
                  data={sampleData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sampleData.map((entry, index) => (
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

          {/* Upcoming Tasks DataGrid */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: 5,
                border: "1px solid lightblue"
              }}
            >
              <Typography variant="subtitle1" color={"white"}>
                Bookmarked Reports
              </Typography>
              <div style={{ height: 237, width: "100%", marginTop: 16 }}>
              <DataGrid rows={upcomingTasks} columns={taskColumns} props hideFooter={true}/>
              </div>
            </Paper>
          </Grid>

          {/* Recent Reports DataGrid */}
          <Grid item xs={12} md={12} >
            <Paper sx={{ p: 2, marginTop: 3, boxShadow: 5, border: "1px solid lightblue"}}>
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