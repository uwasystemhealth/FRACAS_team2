"use client";

/*
 * Better FRACAS
 * Copyright (C) 2023  Peter Tanner, Insan Basrewan, ??? Better Fracas team
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
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material/";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { API_CLIENT, API_ENDPOINT } from "@/helpers/api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { AxiosError } from "axios";

import "@/helpers/urls";

import URLS from "@/helpers/urls";
import { useRouter } from "next/navigation";


interface IFormInputs {
  name: string;
  email: string;
}

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email()
});
export type UserForm = yup.InferType<typeof schema>;

const ReportForm: React.FC = () => {

  const [currentUser, setCurrentUser] = useState<UserForm[]>([]);

  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserForm>({
    resolver: yupResolver(schema),
  });

  const onValid: SubmitHandler<UserForm> = (data, event) => {
    if (submitted) return;
    setSubmitted(true);
    
    (async () => {
      await API_CLIENT.patch(API_ENDPOINT.USER, data)
        .then((response) => {
          if (response.status !== 200) {
            console.error(
              "An error occurred " +
                response.status +
                " " +
                response.data.message
            );
          }
          window.alert("Your details have been updated")
        })
        .catch((error: AxiosError) => {
          console.error(
            "An error occurred " +
              error.message +
              // @ts-ignore: TODO: Add types for generic error response
              error.response?.data["message"]
          );
          window.alert("Sorry, something went wrong.")
        });
    })();
  };

  const fetchCurrentUser = () => {
    API_CLIENT.get(API_ENDPOINT.USER + `/current`)
      .then((response) => {
        if (response.status == 200) {
          setCurrentUser(response.data);
          reset({
            name: response.data.name,
            email: response.data.email
          });
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error: AxiosError) => {
        console.error(error.message);
      });
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <React.Fragment>
          <form onSubmit={handleSubmit(onValid)}>
          <Box sx={{ flexGrow: 1, py: 1 }}>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={4}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Name"
                          variant="outlined"
                          error={!!errors.name}
                          helperText={errors.name ? errors.name?.message : ""}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12} sm={4}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Change Email"
                          variant="outlined"
                          error={!!errors.email}
                          helperText={
                            errors.email
                              ? errors.email?.message
                              : ""
                          }
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            <Box sx={{ display: "flex", justifyContent: "right", pt: 2 }}>
              <Button variant="contained" type="submit">Submit</Button>
            </Box>
          </form>
        </React.Fragment>
    </Box>
  );
};

export default ReportForm;
