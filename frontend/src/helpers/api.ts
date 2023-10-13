import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { string } from "prop-types";

export const API_VERSION = 1;

export const BASE_API_PATH = `/api/v${API_VERSION}`;

export const API_DATE_FORMAT = "YYYY-MM-DD[T]HH:MM:ss.SSS[Z]";

export const API_ENDPOINT = {
  AUTHENTICATION: {
    LOGIN: `${BASE_API_PATH}/authentication/login`,
    SIGNUP_REQUEST: `${BASE_API_PATH}/authentication/signup_request`,
    SIGNUP: `${BASE_API_PATH}/authentication/signup`,
    PASSWORD_RESET: `${BASE_API_PATH}/authentication/password_reset`,
    PASSWORD_RESET_REQUEST: `${BASE_API_PATH}/authentication/password_reset_request`,
    REFRESH: `${BASE_API_PATH}/authentication/refresh`,
    LOGOUT: `${BASE_API_PATH}/authentication/logout`,
    TEST_LOGGED_IN: `${BASE_API_PATH}/authentication/test_logged_in`,
  },
  RECORD: `${BASE_API_PATH}/record`,
  RECORD_STATS: `${BASE_API_PATH}/record/stats`,
  SUBSYSTEM: `${BASE_API_PATH}/subsystem`,
  USER: `${BASE_API_PATH}/user`,
  TEAM: `${BASE_API_PATH}/team`,
  BOOKMARK: `${BASE_API_PATH}/bookmark`,
  // TODO: add /lead
};

export namespace API_TYPES {
  export interface NULLREQUEST_ {}
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
        id: number;
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
      leading?: TEAM.GET.RESPONSE;
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

  export namespace REPORT {
    export namespace POST {
      export interface RESPONSE {
        err: string;
        msg: string;
        id: number;
      }
    }
    export namespace PATCH {
      export interface REQUEST {
        title: string;
        subsystem_id: number;
        description: string;
        impact: string;
        cause: string;
        mechanism: string;
        corrective_action_plan: string;
        time_of_failure: string;
        time_resolved: string;
        car_year: string;
        creator_id: number;
        creator: string;
        notes: string;
        status: string;
      }
      export interface RESPONSE {
        msg: string;
        err: string;
      }
    }
    export namespace DELETE {
      export interface RESPONSE {
        msg: string;
        err: string;
      }
    }
    export namespace GET {
      export interface REQUEST {
        filter_owner?: boolean;
      }
      export interface RESPONSE {
        id: number;
        title: string;
        subsystem_id?: number;
        subsystem?: API_TYPES.SUBSYSTEM.GET.RESPONSE;
        description?: string;
        impact?: string;
        cause?: string;
        mechanism?: string;
        corrective_action_plan?: string;
        time_of_failure: string;
        created_at: string;
        modified_at: string;
        team_id?: number;
        team?: API_TYPES.TEAM.GET.RESPONSE;
        car_year?: number;
        creator_id: number;
        creator: API_TYPES.USER.RESPONSE;
        owner_id?: number;
        owner?: API_TYPES.USER.RESPONSE;
        draft?: boolean;
        marked_for_deletion?: boolean;
        time_resolved?: string;
        record_valid?: boolean;
        analysis_valid?: boolean;
        corrective_valid?: boolean;
        notes?: string;
        stage?: string;
      }
    }
    export namespace STATS {
      export namespace GET {
        export interface RESPONSE {
          team_id?: number;
          team_name?: string;
          open_reports: number;
        }
      }
    }
  }
  export namespace SUBSYSTEM {
    export namespace POST {
      export interface REQUEST {
        subsystem: string;
      }
      export interface RESPONSE {
        id: number;
      }
    }
    export namespace GET {
      export interface RESPONSE {
        id: number;
        name: string;
        team: API_TYPES.TEAM.GET.RESPONSE;
      }
    }
  }
}

export const TOKEN = {
  ACCESS: "access-token",
  REFRESH: "refresh-token",
};

export const AXIOS_CONFIG: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 30000,
};

export const API_CLIENT = axios.create(AXIOS_CONFIG);

API_CLIENT.interceptors.request.use((config) => {
  const access_token = localStorage.getItem(TOKEN.ACCESS);
  config.headers.Authorization = access_token ? `Bearer ${access_token}` : "";
  config.headers["Content-Type"] = "application/json"; // GET requests don't have this automatically set
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_ENDPOINT.AUTHENTICATION.REFRESH}`,
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
