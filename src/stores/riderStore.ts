// src/stores/riderStore.ts
import { defineStore } from "pinia";
import api from "../api/api";

export interface RiderRequest {
  _id: string;
  fuelType: "Petrol" | "Diesel";
  amount: number;
  status: "assigned" | "on_the_way" | "delivered" | "cancelled"; // add real statuses
  user: {
    name: string;
    email: string;
  };
  location: {
    coordinates: number[]; // [longitude, latitude]
  };
  createdAt: string;
}

export const useRiderStore = defineStore("rider", {
  state: () => ({
    requests: [] as RiderRequest[],     // ← Properly initialized
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchMyAssignments() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get("/rider/requests");
        console.log("Fetched Rider Assignments:", res);
        // Always ensure it's an array (safety first)
        this.requests = Array.isArray(res.data.requests) ? res.data.requests : [];
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to load assignments";
        this.requests = []; // Reset on error
      } finally {
        this.loading = false;
      }
    },

    // Rider clicks "Start Delivery" → status: "on_the_way"
    async startDelivery(id: string) {
      try {
        await api.put(`/rider/requests/${id}/status`, { status: "on_the_way" });

        const req = this.requests.find((r) => r._id === id);
        if (req) {
          req.status = "on_the_way";
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to start delivery";
      }
    },

    // Rider clicks "Mark as Delivered" → status: "delivered"
    async completeDelivery(id: string) {
      try {
        await api.put(`/rider/requests/${id}/status`, { status: "delivered" });

        // Option 1: Remove from list (clean UI)
        this.requests = this.requests.filter((r) => r._id !== id);

        // Option 2: Keep and update status (uncomment if preferred)
        // const req = this.requests.find((r) => r._id === id);
        // if (req) req.status = "delivered";
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to complete delivery";
      }
    },
  },
});