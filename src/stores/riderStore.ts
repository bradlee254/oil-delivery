import { defineStore } from "pinia";
import api from "../api/api";

export interface RiderRequest {
  _id: string;
  fuelType: "Petrol" | "Diesel";
  amount: number;
  status: "assigned" | "on_the_way" | "delivered" | "cancelled";
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
    activeRequests: [] as RiderRequest[],    
    completedRequests: [] as RiderRequest[],  
    loading: false,
    error: null as string | null,
    showingCompleted: false,                  
  }),

  actions: {
    async fetchMyAssignments() {
  this.loading = true;
  this.error = null;
  try {
    const res = await api.get("/rider/requests");
    const allRequests = res.data.requests || [];
    this.activeRequests = allRequests.filter(
      (r: RiderRequest) => r.status === "assigned" || r.status === "on_the_way"
    );

    this.completedRequests = allRequests.filter(
      (r: RiderRequest) => r.status === "delivered"
    );
  } catch (err: any) {
    this.error = err.response?.data?.message || "Failed to load assignments";
    this.activeRequests = [];
    this.completedRequests = [];
  } finally {
    this.loading = false;
  }
},



    async startDelivery(id: string) {
      try {
        await api.put(`/rider/requests/${id}/start`);

        const req = this.activeRequests.find((r) => r._id === id);
        if (req) {
          req.status = "on_the_way";
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to start delivery";
      }
    },

    async completeDelivery(id: string) {
  try {
    await api.put(`/rider/requests/${id}/complete`);
    this.activeRequests = this.activeRequests.filter((r) => r._id !== id);
  } catch (err: any) {
    this.error = err.response?.data?.message || "Failed to complete delivery";
  }
},

    // Toggle between active and completed view
    toggleCompletedView() {
      this.showingCompleted = !this.showingCompleted;
    },
  },
});