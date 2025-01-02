import { StateCreator } from "zustand";
import { IUser } from "@/types/user";
import { IFriendRequest } from "@/types/friends";

export interface IUserSlice {
  token: string | null;
  user: IUser | null;
  pendingFriendRequests: IFriendRequest[];
  setToken: (token: string) => void;
  setUser: (user: IUser) => void;
  setPendingFriendRequests: (pendingFriendRequests: IFriendRequest[]) => void;
  flushUser: () => void;
}

export const createUserSlice: StateCreator<IUserSlice> = (set) => ({
  user: null,
  token: null,
  pendingFriendRequests: [],
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setPendingFriendRequests: (pendingFriendRequests) =>
    set({ pendingFriendRequests }),
  flushUser: () => set({ user: null, token: null }),
});
