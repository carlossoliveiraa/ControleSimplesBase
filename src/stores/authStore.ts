import { create } from 'zustand';
import type { Usuario } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: Usuario | null;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: Usuario | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user })
})); 