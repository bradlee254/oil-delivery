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
    async login(email: string, password: string) {
      const res = await api.post("/auth/login", { email, password });
      this.user = res.data.user;
      this.token = res.data.token;
      localStorage.setItem("token", this.token);
    },
    async register(name: string, email: string, password: string) {
      const res = await api.post("/auth/register", { name, email, password });
      this.user = res.data.user;
      this.token = res.data.token;
      localStorage.setItem("token", this.token);
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
