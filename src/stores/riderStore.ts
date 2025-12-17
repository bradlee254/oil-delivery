import { defineStore } from "pinia";
import api from "../api/api";

export interface FuelRequest {
  _id: string;
  user: { name: string; email: string };
  fuelType: "Petrol" | "Diesel";
  amount: number;
  status: "assigned" | "on_the_way" | "delivered";
  deliveryAddress?: string;
  createdAt: string;
}

export const useRiderStore = defineStore("rider", {
  state: () => ({
    requests: [] as FuelRequest[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAssignedRequests() {
      this.loading = true;
      try {
        const res = await api.get("/rider/requests");
        this.requests = res.data.requests;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to fetch requests";
      } finally {
        this.loading = false;
      }
    },

    async updateStatus(requestId: string, status: "on_the_way" | "delivered") {
      try {
        const res = await api.put(`/rider/requests/${requestId}/status`, { status });
        const req = this.requests.find(r => r._id === requestId);
        if (req) req.status = res.data.request.status;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to update status";
      }
    },
  },
});
