import { create } from "zustand";
import { createUserSlice, IUserSlice } from "./userSlice";
import { persist } from "zustand/middleware";

type AppState = IUserSlice; // & IOtherSlice

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
    }),
    {
      name: "zto-next-fb-copy",
    }
  )
);
