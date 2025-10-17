import { create } from "zustand";

interface UserStoreState {
  userId: string | null;
  userName: string | null;
  email: string | null;
  profileImage: string | null;
  theme: "light" | "dark" | "system";
  isAuthenticated: boolean;
  setUser: (data: Partial<UserStoreState>) => void;
  logout: () => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  userId: null,
  userName: null,
  email: null,
  profileImage: null,
  theme: "system",
  isAuthenticated: false,
  setUser: (data) =>
    set((state) => ({ ...state, ...data, isAuthenticated: true })),
  logout: () =>
    set({
      userId: null,
      userName: null,
      email: null,
      profileImage: null,
      theme: "system",
      isAuthenticated: false,
    }),
}));
