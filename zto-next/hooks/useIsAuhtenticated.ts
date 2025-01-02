import { useAppStore } from "@/store/store";

export const useIsAuthenticated = () => {
  const token = useAppStore((state) => state.token);
  return !!token;
};
