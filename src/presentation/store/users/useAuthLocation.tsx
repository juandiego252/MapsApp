import { create } from "zustand";

interface AuthStore {
    isAuthenticated: boolean;
    setIsAuthenticated: (authStatus: boolean) => void;
    userRole: string | null;
    setUserRole: (role: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(set => ({
    isAuthenticated: false,
    userRole: null,
    setIsAuthenticated: (authStatus) => set({ isAuthenticated: authStatus }),
    setUserRole: (role) => set({ userRole: role })
}));