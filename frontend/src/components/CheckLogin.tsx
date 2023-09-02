import { API_CLIENT, API_ENDPOINT, API_TYPES } from "@/helpers/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export enum PAGE_TYPE {
  INTERNAL,
  EXTERNAL,
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
            if (pageType === PAGE_TYPE.EXTERNAL) router.push("/");
          })
          .catch(
            (
              error: AxiosError<API_TYPES.AUTHENTICATION.TEST_LOGGED_IN.RESPONSE>
            ) => {
              if (pageType === PAGE_TYPE.INTERNAL) router.push("/login");
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
