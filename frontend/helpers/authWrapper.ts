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
