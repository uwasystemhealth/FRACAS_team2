/*
 * Better FRACAS
 * Copyright (C) 2023  Peter Tanner, ??? Better Fracas team
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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import { useEffect, useState } from "react";
import { API_CLIENT, API_ENDPOINT, API_TYPES } from "@/helpers/api";
import { AxiosError } from "axios";
import { Switch } from "@mui/material";

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

interface row {
  id: number;
  name: string;
  email: string;
  team: string;
  options: string;
  registered: boolean;
  superuser: boolean;
}

const Members = () => {
  const [rows, setRows] = useState<row[]>([]);

  useEffect(() => {
    (async () => {
      try {
        await API_CLIENT.get<API_TYPES.USER.RESPONSE[]>(API_ENDPOINT.USER)
          .then((response) => {
            console.log(
              response.data.map((user) => {
                const row_: row = {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  team: user.team?.name || "",
                  superuser: user.superuser,
                  registered: user.registered,
                  options: "?",
                };
                return row_;
              })
            );

            setRows(
              response.data.map((user) => {
                const row_: row = {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  team: user.team?.name || "",
                  superuser: user.superuser,
                  registered: user.registered,
                  options: "?",
                };
                return row_;
              })
            );
          })
          .catch((error: AxiosError<API_TYPES.USER.RESPONSE>) => {});
      } catch (error) {}
    })();
  }, []);

  return (
    <React.Fragment>
      <Typography>Members List</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Team</TableCell>
            <TableCell align="center">Registered</TableCell>
            <TableCell align="center">Superuser</TableCell>
            <TableCell align="right">Options</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.team}</TableCell>
              <TableCell align="center">
                {row.registered ? (
                  <CheckCircleOutlineIcon color="success" />
                ) : (
                  <DoNotDisturbIcon color="error" />
                )}
              </TableCell>
              <TableCell align="center">
                <Switch checked={row.superuser} onChange={() => {}} />
              </TableCell>
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
};
export default Members;
