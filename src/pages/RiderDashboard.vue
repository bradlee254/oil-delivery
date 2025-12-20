<script setup lang="ts">
import { onMounted } from "vue";
import { useRiderStore } from "../stores/riderStore";

const riderStore = useRiderStore();

onMounted(() => {
  riderStore.fetchMyAssignments();
});
</script>

<template>
  <div class="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header with Toggle Button -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-slate-900">Rider Dashboard</h1>

        <button
          @click="riderStore.toggleCompletedView()"
          class="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg shadow-md transition"
        >
          {{ riderStore.showingCompleted 
              ? "← Back to Active" 
              : `📦 Completed (${riderStore.completedRequests.length})` 
          }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="riderStore.loading" class="text-center py-12">
        <div class="inline-flex items-center text-lg text-slate-600">
          <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading assignments...
        </div>
      </div>

      <!-- Error -->
      <div v-if="riderStore.error" class="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-lg mb-8">
        <strong>Error:</strong> {{ riderStore.error }}
      </div>

      <!-- Active Deliveries View -->
      <div v-if="!riderStore.showingCompleted">
        <div v-if="riderStore.activeRequests.length === 0 && !riderStore.loading"
             class="bg-amber-50 border-t-4 border-amber-500 rounded-b-lg text-amber-900 px-8 py-12 text-center shadow-lg">
          <svg class="mx-auto h-16 w-16 text-amber-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 class="text-xl font-bold mb-2">No active deliveries</h3>
          <p class="text-lg">Enjoy the calm while it lasts. New assignments will appear here.</p>
        </div>

        <!-- Active Assignment Cards -->
        <div v-for="req in riderStore.activeRequests" :key="req._id"
             class="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-amber-500 mb-8">
          <div class="bg-amber-500 text-slate-900 px-6 py-4">
            <h2 class="text-xl font-bold">Active Delivery</h2>
          </div>

          <div class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <p class="text-sm font-semibold text-slate-700 mb-2">Client</p>
                <p class="text-lg">{{ req.user.name }}</p>
                <p class="text-slate-600">{{ req.user.email }}</p>
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-700 mb-2">Order Details</p>
                <p>{{ req.fuelType }} – {{ req.amount }}L</p>
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-700 mb-2">Status</p>
                <span class="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                  {{ req.status === "assigned" ? "ASSIGNED" : "ON THE WAY" }}
                </span>
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-700 mb-2">Delivery Location</p>
                <p class="font-mono text-sm bg-slate-100 px-3 py-2 rounded">
                  {{ req.location.coordinates.join(", ") }}
                </p>
                <a :href="`https://www.google.com/maps?q=${req.location.coordinates.join(',')}`"
                   target="_blank"
                   class="text-amber-600 hover:text-amber-700 font-medium text-sm mt-2 inline-block">
                  Open in Google Maps →
                </a>
              </div>
            </div>

            <div class="flex gap-4">
              <button
                v-if="req.status === 'assigned'"
                @click="riderStore.startDelivery(req._id)"
                class="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg shadow-md transition"
              >
                🚀 Start Delivery
              </button>

              <button
                v-if="req.status === 'on_the_way'"
                @click="riderStore.completeDelivery(req._id)"
                class="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition"
              >
                ✅ Mark as Delivered
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Completed Deliveries View -->
      <div v-else>
        <h2 class="text-2xl font-bold text-slate-900 mb-6">Completed Deliveries</h2>

        <div v-if="riderStore.completedRequests.length === 0"
             class="bg-slate-50 border-t-4 border-green-500 rounded-b-lg text-slate-700 px-8 py-12 text-center shadow">
          <p class="text-lg">No completed deliveries yet. Keep up the great work!</p>
        </div>

        <div v-for="req in riderStore.completedRequests" :key="req._id"
             class="bg-white rounded-xl shadow overflow-hidden border-t-4 border-green-500 mb-6">
          <div class="bg-green-500 text-white px-6 py-4">
            <h3 class="text-xl font-bold">Delivered</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p class="text-sm font-semibold text-slate-700">Client</p>
                <p>{{ req.user.name }}</p>
                <p class="text-slate-600 text-sm">{{ req.user.email }}</p>
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-700">Fuel Delivered</p>
                <p>{{ req.fuelType }} – {{ req.amount }}L</p>
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-700">Date Completed</p>
                <p>{{ new Date(req.createdAt).toLocaleDateString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>