import { StateCreator } from "zustand";
import { IUser } from "@/types/user";

export interface IUserSlice {
  token: string | null;
  user: IUser | null;
  setToken: (token: string) => void;
  setUser: (user: IUser) => void;
  flushUser: () => void;
}

export const createUserSlice: StateCreator<IUserSlice> = (set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  flushUser: () => set({ user: null, token: null }),
});
