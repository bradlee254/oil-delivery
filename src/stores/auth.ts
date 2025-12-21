// src/stores/auth.ts
import { defineStore } from "pinia";
import api from "../api/api";

interface User {
  _id: string;        // MongoDB uses _id, not id
  name: string;
  email: string;
  role: "customer" | "rider" | "admin";
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    isLoggedIn: false,
  }),

  actions: {
    // Called on app start (in main.ts) and in router guard
    init() {
      // Use sessionStorage → clears when tab closes
      const token = sessionStorage.getItem("token");
      const userStr = sessionStorage.getItem("user");

      if (token && userStr) {
        this.token = token;
        this.user = JSON.parse(userStr);
        this.isLoggedIn = true;

        // Set authorization header for all future requests
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        this.logout(); // Ensure clean state
      }
    },

    async login(email: string, password: string) {
      try {
        const res = await api.post("/auth/login", { email, password });

        this.token = res.data.token;
        this.user = res.data.user;
        this.isLoggedIn = true;

        // Save to sessionStorage (not localStorage)
        sessionStorage.setItem("token", this.token);
        sessionStorage.setItem("user", JSON.stringify(this.user));

        // Set header for subsequent requests
        api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } catch (err: any) {
        throw err.response?.data?.message || "Login failed";
      }
    },

    async register(name: string, role: string, email: string, password: string) {
      try {
        const res = await api.post("/auth/register", {
          name,
          email,
          password,
          role,
        });

        this.token = res.data.token;
        this.user = res.data.user;
        this.isLoggedIn = true;

        sessionStorage.setItem("token", this.token);
        sessionStorage.setItem("user", JSON.stringify(this.user));

        api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } catch (err: any) {
        throw err.response?.data?.message || "Registration failed";
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isLoggedIn = false;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      delete api.defaults.headers.common["Authorization"];
    },
  },

  getters: {
    role(): string {
      return this.user?.role || "customer";
    },
  },
});