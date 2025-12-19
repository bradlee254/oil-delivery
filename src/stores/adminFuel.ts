import { defineStore } from "pinia";
import api from "../api/api";

export interface Rider {
  _id: string;
  name: string;
  email: string;
}

export interface Request {
  _id: string;
  user: { name: string; email: string };
  fuelType: "Petrol" | "Diesel";
  amount: number;
  status: "pending" | "delivered" | "cancelled";
  deliveryAddress?: string;
  createdAt: string;
  rider?: Rider;
}

export const useAdminFuelStore = defineStore("adminFuel", {
  state: () => ({
    requests: [] as Request[],
    riders: [] as Rider[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAllRequests() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get("/fuel/all");
        this.requests = res.data;
      } catch (err: any) {
        this.error = "Failed to fetch requests";
      } finally {
        this.loading = false;
      }
    },

    async fetchRiders() {
      const res = await api.get("/admin/riders");
      this.riders = res.data.riders;
    },

    async assignRider(requestId: string, riderId: string) {
      await api.put(`/admin/requests/${requestId}/assign`, { riderId });

      const req = this.requests.find(r => r._id === requestId);
      const rider = this.riders.find(r => r._id === riderId);

      if (req && rider) {
        req.rider = rider;
      }
    },
  },
});
