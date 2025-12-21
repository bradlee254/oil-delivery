import { defineStore } from "pinia";
import api from "../api/api";

interface FuelRequest {
  _id: string;
  fuelType: "Petrol" | "Diesel";
  amount: number;
  status: "pending" | "delivered" | "cancelled";
  location: { type: string; coordinates: number[] };
  createdAt: string;
}

export const useFuelStore = defineStore("fuel", {
  state: () => ({
    requests: [] as FuelRequest[],
  }),

  actions: {
    // Fetch all requests 
    async fetchMyRequests() {
      try {
        const res = await api.get("/fuel/requests");
        this.requests = res.data.requests;
      } catch (err: any) {
        throw err.response?.data?.message || "Failed to fetch requests";
      }
    },

    // Create a new fuel request
    async createRequest(fuelType: "Petrol" | "Diesel", amount: number, coordinates: number[]) {
      try {
        const res = await api.post("/fuel/request", { fuelType, amount, coordinates });
        this.requests.unshift(res.data.fuelRequest); // add to top of list
      } catch (err: any) {
        throw err.response?.data?.message || "Failed to create request";
      }
    },
  },
});
