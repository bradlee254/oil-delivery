import { defineStore } from "pinia";
import api from "../api/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem("token") || null,
  }),

  actions: {
    // Initialize Authorization header if token exists
    init() {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    },

    // Login user
    async login(email: string, password: string) {
      try {
        const res = await api.post("/auth/login", { email, password });
        this.user = res.data.user;
        this.token = res.data.token;
        localStorage.setItem("token", this.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } catch (err: any) {
        throw err.response?.data?.message || "Login failed";
      }
    },

    // Register user
    async register(name: string, email: string, password: string) {
      try {
        const res = await api.post("/auth/register", { name, email, password });
        this.user = res.data.user;
        this.token = res.data.token;
        localStorage.setItem("token", this.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } catch (err: any) {
        throw err.response?.data?.message || "Registration failed";
      }
    },

    // Logout user
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    },
  },
});
