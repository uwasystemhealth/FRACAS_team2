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

import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import {Container,Paper,Grid, TextField, useMediaQuery} from "@mui/material";
import Typography from "@mui/material/Typography";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import PieChartIcon from '@mui/icons-material/PieChart';
import MinimizeIcon from '@mui/icons-material/Minimize';

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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showPieChart, setShowPieChart] = useState(!isMobile);
  const [chartDimensions, setChartDimensions] = useState({ width: 300, height: 250 });

  useEffect(() => {
    const handleResize = () => {
      if (isMobile) {
        const chartWidth = window.innerWidth - 32;
        const chartHeight = 200;
        setChartDimensions({ width: window.innerWidth - 32, height: 200 });
        setShowPieChart(false);
      } else {
        setChartDimensions({ width: 300, height: 250 });
        setShowPieChart(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);  

  const togglePieChart = () => {
    setShowPieChart(!showPieChart);
  };

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
    {field: "reportName", headerName: "Report Name", flex: isMobile ? 1 : 2} ,
    {field: "date", headerName: "Date Created", flex: isMobile ? 1 : 2 },
    {field: "status", headerName: "Status", flex: isMobile ? 1 : 2 },
    {
      field: "view",
      headerName: "View",
      flex: isMobile ? 1 : 2 ,
      renderCell: (params) => (
        <IconButton color="primary" aria-label="View" href = "/viewreport">
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  const reportColumns = [
    { field: "id", headerName: "ID", width: 60},
    { field: "ReportName", headerName: "Report name", flex: isMobile ? 1 : 2  },
    { field: "date", headerName: "Creation Date", flex: isMobile ? 1 : 2  },
    { field: "carYear", headerName: "Car year", flex: isMobile ? 1 : 2 },
    { field: "creatorName", headerName: "Creator name", flex: isMobile ? 1 : 2},
    { field: "status", headerName: "Status", flex: isMobile ? 1 : 2 },
    {
      field: "edit",
      headerName: "Edit",
      flex: isMobile ? 1 : 2 ,
      renderCell: (params) => (
        <IconButton color="primary" aria-label="Edit" href = '/editreport'>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "view",
      headerName: "View",
      flex: isMobile ? 1 : 2 ,
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
  ];

  return (
    <div style={{ display: "flex" }}>
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, p: 1, marginTop: "0px", marginLeft: "0px", marginRight: "0px" }}>
        <Grid container spacing={4} rowSpacing={1}>
          {showPieChart ? (
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, margin:0, boxShadow: 5, border: "1px solid lightblue", width: '100%'}}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: 16 }} color={"white"}>
                  Open Reports By Team
                </Typography>
                <PieChart width={chartDimensions.width} height={chartDimensions.height}>
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
                <IconButton onClick={togglePieChart}>
                  <MinimizeIcon />
                </IconButton>
              </Paper>
            </Grid>
          ) : (
            <Grid item xs={12} md={4}>
              <IconButton onClick={togglePieChart}>
                <PieChartIcon />
              </IconButton>
            </Grid>
        )}
          {/* Bookmarked Reports DataGrid */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 2,
                height: "100%",
                width: '100%',
                display: "flex",
                flexDirection: "column",
                boxShadow: 5,
                border: "1px solid lightblue"
              }}
            >
              <Typography variant="subtitle1" color="primary">
                Bookmarked Reports
              </Typography>
              <div style={{ height: 237, width: "100%", marginTop: 16 }}>
              {isMobile ? (
                <DataGrid
                  rows={upcomingTasks}
                  columns={taskColumns.filter(col => col.field !== 'id')}
                  props
                  hideFooter={true}
                />
              ) : (
                <DataGrid rows={upcomingTasks} columns={taskColumns} props hideFooter={true} />
              )}
              </div>
            </Paper>
          </Grid>

          {/* Recent Reports DataGrid */}
          <Grid item xs={12} md={12} >
            <Paper sx={{ p: 2, marginTop: 3, boxShadow: 5, border: "1px solid lightblue", width: '100%'}}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
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
              {isMobile ? (
            <DataGrid rows={filteredReports} columns={reportColumns.filter(col => col.field !== 'carYear' && col.field !== 'creatorName' && col.field !== 'edit' && col.field !== 'id')} autoHeight />
          ) : (
            <DataGrid rows={filteredReports} columns={reportColumns} autoHeight />
          )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;