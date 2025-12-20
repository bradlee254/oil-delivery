<script setup lang="ts">
import { onMounted } from "vue";
import { useRiderStore } from "../stores/riderStore";

const riderStore = useRiderStore();

onMounted(() => {
  riderStore.fetchMyAssignments();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Rider Dashboard</h1>

      <!-- Loading State -->
      <div v-if="riderStore.loading" class="text-center py-12">
        <div class="inline-flex items-center text-lg text-gray-600">
          <svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading your assignments...
        </div>
      </div>

      <!-- Error State -->
      <div v-if="riderStore.error" class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
        <strong>Error:</strong> {{ riderStore.error }}
      </div>

      <!-- No Assignments -->
      <div v-if="!riderStore.loading && riderStore.requests.length === 0" class="bg-amber-50 border border-amber-200 text-amber-800 px-8 py-12 rounded-xl text-center">
        <svg class="mx-auto h-16 w-16 text-amber-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="text-xl font-semibold mb-2">No active deliveries</h3>
        <p class="text-lg">Enjoy the calm while it lasts. New assignments will appear here when available.</p>
      </div>

      <!-- Assignments List -->
      <div v-for="req in riderStore.requests" :key="req._id" class="bg-white shadow-lg rounded-xl overflow-hidden mb-8 border border-gray-200">
        <div class="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-4">
          <h2 class="text-xl font-bold">Delivery Assignment</h2>
          <p class="text-amber-100">Order ID: {{ req._id }}</p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Client Info -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">Client</h3>
              <p class="text-gray-700"><strong>Name:</strong> {{ req.user.name }}</p>
              <p class="text-gray-700"><strong>Email:</strong> {{ req.user.email }}</p>
            </div>

            <!-- Order Details -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">Order Details</h3>
              <p class="text-gray-700"><strong>Fuel Type:</strong> {{ req.fuelType }}</p>
              <p class="text-gray-700"><strong>Amount:</strong> {{ req.amount }} Liters</p>
            </div>

            <!-- Status -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">Current Status</h3>
              <span class="inline-block px-4 py-2 rounded-full text-sm font-medium"
                    :class="{
                      'bg-yellow-100 text-yellow-800': req.status === 'assigned',
                      'bg-blue-100 text-blue-800': req.status === 'on_the_way',
                      'bg-green-100 text-green-800': req.status === 'delivered',
                      'bg-gray-100 text-gray-800': req.status === 'cancelled'
                    }">
                {{ req.status.replace("_", " ").toUpperCase() }}
              </span>
            </div>

            <!-- Location -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">Delivery Location</h3>
              <p class="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                {{ req.location.coordinates.join(", ") }}
              </p>
              <!-- Optional: Add a "Open in Maps" link -->
              <a :href="`https://www.google.com/maps?q=${req.location.coordinates.join(',')}`"
                 target="_blank"
                 class="text-amber-600 hover:text-amber-700 text-sm font-medium mt-2 inline-block">
                Open in Google Maps →
              </a>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <!-- Start Delivery Button -->
            <button
              v-if="req.status === 'assigned'"
              @click="riderStore.startDelivery(req._id)"
              class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition transform hover:scale-105"
            >
              🚀 Start Delivery
            </button>

            <!-- Mark as Delivered Button -->
            <button
              v-if="req.status === 'on_the_way'"
              @click="riderStore.completeDelivery(req._id)"
              class="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow transition transform hover:scale-105"
            >
              ✅ Mark as Delivered
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add smooth transitions */
button {
  transition: all 0.2s ease;
}
</style>