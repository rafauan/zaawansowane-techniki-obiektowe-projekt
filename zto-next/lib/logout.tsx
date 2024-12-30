"use client";

import { useRouter } from "next/navigation";
import { useIsAuthenticated } from "@/hooks/useIsAuhtenticated";
import { useAppStore } from "@/store/store";

export default function LogoutButton() {
  const isAuthenticated = useIsAuthenticated();
  const flushUser = useAppStore((state) => state.flushUser);
  const router = useRouter();

  const signout = () => {
    flushUser();
    router.push("/login");
    window.location.reload();
  };

  return isAuthenticated ? <button onClick={signout}>Logout</button> : null;
}
