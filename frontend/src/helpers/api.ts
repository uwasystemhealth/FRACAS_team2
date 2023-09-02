import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BACKEND_URL } from "./constants";
import { string } from "prop-types";

export const API_ENDPOINT = {
  AUTHENTICATION: {
    LOGIN: "/api/v1/authentication/login",
    SIGNUP_REQUEST: "/api/v1/authentication/signup_request",
    SIGNUP: "/api/v1/authentication/signup",
    REFRESH: "/api/v1/authentication/refresh",
    LOGOUT: "/api/v1/authentication/logout",
    TEST_LOGGED_IN: "/api/v1/authentication/test_logged_in",
  },
  USER: "/api/v1/user",
  TEAM: "/api/v1/team", // TODO: add /leader
};

export namespace API_TYPES {
  export namespace AUTHENTICATION {
    export namespace LOGIN {
      export interface REQUEST {
        email: string;
        password: string;
      }
      export interface RESPONSE {
        access_token: string;
        refresh_token: string;
      }
    }
    export namespace SIGNUP {
      export interface REQUEST {
        token: string;
        password: string;
      }
      export interface RESPONSE {
        err: string;
        msg: string;
      }
    }
    export namespace TEST_LOGGED_IN {
      export interface RESPONSE {
        msg: string;
        email: string;
        superuser: boolean;
      }
    }
  }

  export namespace USER {
    export interface RESPONSE {
      id: number;
      email: string;
      registered: boolean;
      superuser: boolean;
      name: string;
      created_at: string;
      // teams: number[];
      team_id?: number;
      team?: TEAM.GET.RESPONSE;
      leading_team?: TEAM.GET.RESPONSE;
    }
  }

  export namespace TEAM {
    export namespace GET {
      export interface RESPONSE {
        created_at: string;
        id: number;
        inactive: boolean;
        leader?: USER.RESPONSE;
        leader_id?: number;
        members: USER.RESPONSE[];
        name: string;
      }
    }
  }
}

export const TOKEN = {
  ACCESS: "access-token",
  REFRESH: "refresh-token",
};

export const AXIOS_CONFIG: AxiosRequestConfig = {
  baseURL: BACKEND_URL,
  timeout: 30000,
};

export const API_CLIENT = axios.create(AXIOS_CONFIG);

API_CLIENT.interceptors.request.use((config) => {
  const access_token = localStorage.getItem(TOKEN.ACCESS);
  config.headers.Authorization = access_token ? `Bearer ${access_token}` : "";
  return config;
});

// refresh tokens
API_CLIENT.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to expired token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (originalRequest.url === API_ENDPOINT.AUTHENTICATION.REFRESH) {
        console.error("Failed to refresh token");
        return;
      }

      try {
        // Refresh the access token
        const response = await axios.post(
          `${BACKEND_URL}${API_ENDPOINT.AUTHENTICATION.REFRESH}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(TOKEN.REFRESH)}`,
            },
          }
        );

        const newAccessToken = response.data.access_token;
        localStorage.setItem(TOKEN.ACCESS, newAccessToken);

        // Update the authorization header and retry the original request
        //  TODO: chekc
        API_CLIENT.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return API_CLIENT(originalRequest);
      } catch (refreshError) {
        // Handle refresh error, e.g., redirect to login page
        console.error("Failed to refresh token", refreshError);
        // You might want to handle refresh error according to your app's logic
      }
    }

    return Promise.reject(error);
  }
);
