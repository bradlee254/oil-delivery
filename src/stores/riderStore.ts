import { defineStore } from "pinia";
import api from "../api/api";

export interface RiderRequest {
  _id: string;
  fuelType: "Petrol" | "Diesel";
  amount: number;
  status: "pending" | "delivered";
  user: {
    name: string;
    email: string;
  };
  location: {
    coordinates: number[];
  };
  createdAt: string;
}

export const useRiderStore = defineStore("rider", {
  state: () => ({
    requests: [] as RiderRequest[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchMyAssignments() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get("/riders/my-assignments");
        this.requests = res.data.requests;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to load assignments";
      } finally {
        this.loading = false;
      }
    },

    async markDelivered(requestId: string) {
      try {
        await api.put(`/riders/complete/${requestId}`);
        const req = this.requests.find(r => r._id === requestId);
        if (req) req.status = "delivered";
      } catch (err: any) {
        throw err.response?.data?.message || "Failed to complete delivery";
      }
    },
  },
});
