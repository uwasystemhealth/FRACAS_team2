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

import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { AxiosError } from "axios";
import { API_CLIENT, API_TYPES, API_ENDPOINT } from "@/helpers/api";

// Generate Order Data
function createData(
  id: number,
  name: string,
  number_of_members: number,
  options: string
) {
  return { id, name, number_of_members, options };
}

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

interface row {
  id: number;
  name: string;
  number_of_members: number;
  options: string;
}

export default function Teams() {
  const [rows, setRows] = React.useState<row[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        await API_CLIENT.get<API_TYPES.TEAM.GET.RESPONSE[]>(API_ENDPOINT.TEAM)
          .then((response) => {
            setRows(
              response.data.map((team) =>
                createData(team.id, team.name, team.members.length, "?")
              )
            );
          })
          .catch((error: AxiosError<API_TYPES.TEAM.GET.RESPONSE>) => {});
      } catch (error) {}
    })();
  }, []);

  return (
    <React.Fragment>
      <Typography>Teams List</Typography>
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
              <TableCell>{row.name}</TableCell>
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
