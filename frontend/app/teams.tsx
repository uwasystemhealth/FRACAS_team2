import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

// Generate Order Data
function createData(
  id: number,
  team_name: string,
  number_of_members: number,
  options: string,
) {
  return { id, team_name, number_of_members, options };
}

const rows = [
  createData(0, "NIL", 0, "NIL")
];

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Teams() {
  return (
    <React.Fragment>
      <Title>Teams List</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Team Name</TableCell>
            <TableCell>Number of Members</TableCell>
            <TableCell align="right">Options</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.team_name}</TableCell>
              <TableCell>{row.number_of_members}</TableCell>
              <TableCell align="right">{row.options}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        View more teams
      </Link>
    </React.Fragment>
  );
}
