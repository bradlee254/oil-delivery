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
        const res = await api.get("/rider/requests");
        this.requests = res.data.requests;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to load assignments";
      } finally {
        this.loading = false;
      }
    },
    async startDelivery(id: string){
      await api.put(`/rider/start/${id}`);
      const req = this.requests.find(r => r._id === id);
      if (req) 
        req.status = "delivered";
      
    }, 

    async completeDelivery(id: string){
      await api.put(`/rider/complete/${id}`);
      const req = this.requests.find(r => r._id === id);
      if (req) 
        req.status = "delivered";
      
    }

    
  },
});
