'use client'
import React from 'react';
import { AppBar, Container, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Divider, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const upcomingTasks = [
    { id: 1, reportName: 'Report 1', assigner: 'John Doe', dueDate: '2023-08-24' },
    { id: 2, reportName: 'Report 2', assigner: 'Jane Smith', dueDate: '2023-08-28' },
    { id: 3, reportName: 'Report 3', assigner: 'John Doe', dueDate: '2023-08-29' },
  ];

  const recentReports = [
    { id: 1, dateCreated: '2023-08-25', title: 'Report 1', creator: 'John Doe', status: 'Open' },
    { id: 2, dateCreated: '2023-08-24', title: 'Report 2', creator: 'Jane Smith', status: 'Draft' },
  ];

  const upcomingTasksCount = upcomingTasks.length;
  const pieChartColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF73FA'];


  const sampleData = [
    { name: 'Electrical', value: 30 },
    { name: 'Subsytem', value: 45 },
    { name: 'Mechanical', value: 20 },
    // Add more sample data...
  ];

  return (
    <div style={{ display: 'flex' }}>
      {/* Main Content */}
      <Container component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px'  }}>
        {/* Layout using Grid */}
        <Grid container spacing={2}>
          {/* Bar Graph */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: 16}} >
                Failure Reports by Team
              </Typography>
              <BarChart width={250} height={250} data={sampleData}>
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
            <Paper sx={{ p: 2}}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: 16}}>
                Resolution Rate
              </Typography>
              <PieChart width={250} height={250}>
                <Pie
                  data={sampleData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sampleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Paper>
          </Grid>

          {/* Upcoming Tasks Tile */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1">
                You have {upcomingTasksCount} upcoming tasks
              </Typography>
              <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                  <TableBody>
                    {upcomingTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell sx={{ fontSize: 12 }}>{task.reportName}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{task.assigner}</TableCell>
                        <TableCell sx={{ fontSize: 12, color: 'red' }}>{task.dueDate}</TableCell>
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
                  {recentReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.dateCreated}</TableCell>
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