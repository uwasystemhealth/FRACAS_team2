/*
 * Better FRACAS
 * Copyright (C) 2023  Peter Tanner
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

import SignUpForm from "@/components/SignUpForm";
import { API_ENDPOINT } from "@/helpers/api";
import { Link, Typography } from "@mui/material";
import React from "react";

const SignUp = () => (
  <SignUpForm
    title="Password reset"
    description={
      <>
        <Typography>
          Enter a new password. And don't lose it this time.
        </Typography>
        <Link href="https://en.wikipedia.org/wiki/List_of_password_managers?&useskin=vector">
          https://en.wikipedia.org/wiki/List_of_password_managers
        </Link>
      </>
    }
    endpoint={API_ENDPOINT.AUTHENTICATION.PASSWORD_RESET}
    url_params="reset_pwd=1"
  />
);

export default SignUp;
