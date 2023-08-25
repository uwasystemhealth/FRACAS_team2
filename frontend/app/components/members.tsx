import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../Title';

// Generate Order Data
function createData(
  id: number,
  name: string,
  email: string,
  team: string,
  options: string,
) {
  return { id, name, email, team, options };
}

const rows = [
  createData(0, "NIL", "NIL", "NIL", "NIL")
];

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Members() {
  return (
    <React.Fragment>
      <Title>Members List</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Team</TableCell>
            <TableCell align="right">Options</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.team}</TableCell>
              <TableCell align="right">{row.options}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        View more members
      </Link>
    </React.Fragment>
  );
}
