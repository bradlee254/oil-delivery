import { defineStore } from "pinia";
import api from "../api/api";

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

export interface Rider {
  _id: string;
  name: string;
  phone: string;
  status: "available" | "busy";
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
      try {
        const res = await api.get("/fuel/all");
        this.requests = res.data;
      } finally {
        this.loading = false;
      }
    },

    async fetchRiders() {
      const res = await api.get("/riders");
      this.riders = res.data.filter((r: Rider) => r.status === "available");
    },

    async assignRider(requestId: string, riderId: string) {
      await api.put(`/riders/assign/${requestId}`, { riderId });

      const req = this.requests.find((r) => r._id === requestId);
      const rider = this.riders.find((r) => r._id === riderId);

      if (req && rider) {
        req.rider = rider;
      }
    },
  },
});
