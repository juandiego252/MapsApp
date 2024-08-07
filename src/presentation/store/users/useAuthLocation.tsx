import { create } from "zustand";

interface AuthStore {
    isAuthenticated: boolean;
    setIsAuthenticated: (authStatus: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(set => ({
    isAuthenticated: false,
    setIsAuthenticated: (authStatus) => set({ isAuthenticated: authStatus }),
}));