import { useIsAuthenticated } from "@/hooks/useIsAuhtenticated";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function userAuthenticated(): boolean {
  const token = localStorage.getItem("token");

  return !!token;
}

export function AllowOnlyNotAuthenticated(WrappedComponent: any) {
  return (props: any) => {
    const isAuthenticated = useIsAuthenticated();
    const [canView, setCanView] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if (isAuthenticated) {
        router.push("/");
        return;
      } else {
        setCanView(true);
      }
    }, [isAuthenticated]);

    return canView ? <WrappedComponent {...props} /> : null;
  };
}

export function AllowOnlyAuthenticated(WrappedComponent: any) {
  return (props: any) => {
    const isAuthenticated = useIsAuthenticated();
    const [canView, setCanView] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if (isAuthenticated) {
        setCanView(true);
      } else {
        router.push("/login");
      }
    }, [isAuthenticated]);

    return canView ? <WrappedComponent {...props} /> : null;
  };
}
