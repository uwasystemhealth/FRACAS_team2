import axios, { AxiosRequestConfig } from "axios";
import { BACKEND_URL } from "./constants";

export const AXIOS_CONFIG: AxiosRequestConfig = {
  baseURL: BACKEND_URL,
  timeout: 30000,
};

export const API_CLIENT = axios.create(AXIOS_CONFIG);

export const API_ENDPOINT = {
  AUTHENTICATION: {
    LOGIN: "/api/v1/authentication/login",
  },
};
