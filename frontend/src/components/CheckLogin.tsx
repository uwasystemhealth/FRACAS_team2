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

import { API_CLIENT, API_ENDPOINT, API_TYPES } from "@/helpers/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export enum PAGE_TYPE {
  INTERNAL,
  EXTERNAL,
  LANDING
}

interface props {
  pageType: PAGE_TYPE;
}

const CheckLogin = (props: props) => {
  const { pageType } = props;
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        await API_CLIENT.get<API_TYPES.AUTHENTICATION.TEST_LOGGED_IN.RESPONSE>(
          API_ENDPOINT.AUTHENTICATION.TEST_LOGGED_IN
        )
          .then((response) => {
            if (pageType === PAGE_TYPE.EXTERNAL) router.push("/dashboard");
          })
          .catch(
            (
              error: AxiosError<API_TYPES.AUTHENTICATION.TEST_LOGGED_IN.RESPONSE>
            ) => {
              router.push("/login");
            }
          );
      } catch (error) {
        router.push("/login");
      }
    })();
  }, []);

  return <React.Fragment></React.Fragment>;
};

export default CheckLogin;
