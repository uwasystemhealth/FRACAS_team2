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
import { Container, Paper, Grid, TextField, useMediaQuery } from "@mui/material";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box"
//import { selectCols } from "@/components/ReportList";

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
import ReportList, { UserReport } from "@/components/ReportList";
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";

interface PieChart {
  name: string;
  value: number;
}

const BookmarkDataGridState: GridInitialStateCommunity = {
  sorting: {
    sortModel: [{ field: 'modified_at', sort: 'desc' }]
  },
  columns: {
    columnVisibilityModel: {
      creator: false,
      created_at: false,
      description: false,
      car_year: false,
      owner: false,
      edit: false,
      delete: false,
    },
  },
}

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ownedReports, setOwnedReports] = useState<UserReport[]>([]);
  const [bookmarkedReports, setBookmarkedReports] = useState<UserReport[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [pieChartData, setPieChartData] = useState<PieChart[]>([]);
  const [chartDimensions, setChartDimensions] = useState({ width: 300, height: 250 });
  const [showPieChart, setShowPieChart] = useState(!isMobile);
  const [width_subtract, setWidthSubtract] = useState(0);

  const handleResize = () => {
    if (isMobile) {
      const chartWidth = window.innerWidth - 32;
      const chartHeight = 200;
      setChartDimensions({ width: window.innerWidth - 32, height: 200 });
      setShowPieChart(false);
      setWidthSubtract(0);
    } else {
      setChartDimensions({ width: 300, height: 250 });
      setShowPieChart(true);
      setWidthSubtract(400);
    }
  };

  const fetchOwnedReports = async () => {
    try {
      const response = await API_CLIENT.get<
        API_TYPES.REPORT.GET.REQUEST,
        AxiosResponse<API_TYPES.REPORT.GET.RESPONSE[]>
      >(API_ENDPOINT.RECORD, { params: {filter_owner: true } })
        .then((response) => {
          if (response) {
            // @ts-ignore
            setOwnedReports(response.data);
          } else {
            console.error("An error occurred");
          }
        })
        .catch((error: AxiosError) => {
          console.error("An error occurred " + error.message);
        });

      // Do something with the token (e.g., store it)
    } catch (error: any) {}
  }
  
  const fetchBookmarkedReports = async () => {
    try {
      const response = await API_CLIENT.get<
        API_TYPES.REPORT.GET.REQUEST,
        AxiosResponse<API_TYPES.REPORT.GET.RESPONSE[]>
      >(API_ENDPOINT.RECORD, { params: {filter_bookmarks: true } })
        .then((response) => {
          if (response) {
            // @ts-ignore
            setBookmarkedReports(response.data);
          } else {
            console.error("An error occurred");
          }
        })
        .catch((error: AxiosError) => {
          console.error("An error occurred " + error.message);
        });

      // Do something with the token (e.g., store it)
    } catch (error: any) {}
  }

  const fetchPieData = async () => {
    try {
      const response = await API_CLIENT.get<
        API_TYPES.NULLREQUEST_,
        AxiosResponse<API_TYPES.REPORT.STATS.GET.RESPONSE[]>
      >(API_ENDPOINT.RECORD_STATS, {})
        .then((response) => {
          if (response) {
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
  }

  useEffect(() => {
    fetchOwnedReports();
    fetchBookmarkedReports();
    fetchPieData();
  }, []);

  const togglePieChart = () => {
    setShowPieChart(!showPieChart);
  }

  const pieChartColors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF73FA",
  ];

  return (
      <Box
        component="main"
        sx={{
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
                display: "flex",
                flexDirection: "column",
                border: "1px solid lightblue",
                width: '100%'
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
              <PieChart width={chartDimensions.width} height={chartDimensions.height}>
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
                display: "flex",
                flexDirection: {xs: "column", sm: "row"},
                boxShadow: 5,
                border: "1px solid lightblue",
              }}
            >
              <Typography variant="subtitle1" color={"white"}>
                You have{" "}
                <span style={{ color: "red" }}>{bookmarkedReports.length}</span>{" "}
                bookmarked tasks
              </Typography>
                <ReportList rows={bookmarkedReports} setRows={setBookmarkedReports} 
                initialstate={BookmarkDataGridState} search={false}/>
            </Paper>
          </Grid>

          {/* Recent Reports DataGrid */}
          <Grid item xs={12} md={12}>
            <Paper
              sx={{
                p: 2,
                marginTop: 3,
                boxShadow: 5,
                display: "flex",
                flexDirection: {xs: "column", sm: "row"},
                border: "1px solid lightblue",
              }}
            >
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Your Reports
              </Typography>
              <ReportList rows={ownedReports} setRows={setOwnedReports} />
            </Paper>
          </Grid>
        </Grid>
        </Box>
  );
};

export default Dashboard;
