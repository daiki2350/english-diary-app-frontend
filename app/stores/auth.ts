// src/stores/auth.ts
import { create } from "zustand"

type User = {
  username: string
  email: string
}

type AuthState = {
  token: string | null
  user: User | null
  hydrated: boolean
  setAuth: (token: string, user: User) => void
  logout: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,

  setAuth: (token, user) => {
    localStorage.setItem("token", token)
    set({ token, user, hydrated: true })
  },

  hydrate: () => {
    const token = localStorage.getItem("token")
    if (token) set({ token, hydrated: true })
  },

  logout: () => {
    localStorage.removeItem("token")
    set({ token: null, user: null })
  },
}))
