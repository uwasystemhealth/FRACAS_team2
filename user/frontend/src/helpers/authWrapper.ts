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

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TOKEN } from "./api";

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const router = useRouter();
    useEffect(() => {
      // TODO: CHECK IF THIS WORKS WITH EXPIRED ACCESS-TOKEN
      const token = localStorage.getItem(TOKEN.ACCESS); // Retrieve token from local storage

      if (!token) {
        router.push("/login"); // Redirect to login page if not authenticated
      }
    }, []);

    return WrappedComponent(props);
  };
};

export default withAuth;