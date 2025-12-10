import { defineStore } from "pinia";
import api from "../api/api";

interface FuelRequest {
  _id: string;
  user: { name: string; email: string };
  fuelType: "Petrol" | "Diesel";
  amount: number;
  status: "pending" | "delivered" | "cancelled";
  location: { type: string; coordinates: number[] };
  createdAt: string;
}

export const useAdminFuelStore = defineStore("adminFuel", {
  state: () => ({
    requests: [] as FuelRequest[],
  }),

  actions: {
    async fetchAllRequests() {
      try {
        const res = await api.get("/fuel/all");
        this.requests = res.data;
      } catch (err: any) {
        throw err.response?.data?.message || "Failed to fetch all requests";
      }
    },

    async updateRequestStatus(id: string, status: "pending" | "delivered" | "cancelled") {
      try {
        const res = await api.put(`/fuel/${id}/status`, { status });
        // Update local state
        const index = this.requests.findIndex(r => r._id === id);
        if (index !== -1) this.requests[index].status = res.data.request.status;
      } catch (err: any) {
        throw err.response?.data?.message || "Failed to update status";
      }
    },
  },
});
