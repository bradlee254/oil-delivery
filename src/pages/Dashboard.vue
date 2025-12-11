<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFuelStore } from "../stores/fuel";

const fuelStore = useFuelStore();

// Form state
const fuelType = ref<"Petrol" | "Diesel">("Petrol");
const amount = ref<number>(1);
const coordsInput = ref("");

// Submit new request
const submitRequest = async () => {
  try {
    const coords = coordsInput.value.split(",").map(c => parseFloat(c.trim()));
    if (coords.length !== 2 || coords.some(isNaN)) {
      alert("Please enter valid coordinates: lng, lat");
      return;
    }
    await fuelStore.createRequest(fuelType.value, amount.value, coords);
    alert("Fuel request created!");
    // Reset form
    amount.value = 1;
    coordsInput.value = "";
  } catch (err: any) {
    alert(err);
  }
};

// Load user requests on mount
onMounted(() => {
  fuelStore.fetchMyRequests();
});
</script>

<template>
  <div class="min-h-screen bg-slate-100 py-8 px-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p class="text-slate-600">Manage your fuel delivery requests</p>
      </div>

      <!-- Fuel Request Form -->
      <div class="mb-8 bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-amber-500">
        <div class="bg-slate-900 px-6 py-4">
          <h2 class="text-xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" />
              <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
            </svg>
            New Fuel Request
          </h2>
        </div>
        
        <form @submit.prevent="submitRequest" class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Fuel Type</label>
            <select 
              v-model="fuelType" 
              class="w-full border-2 border-slate-300 rounded-lg p-3 focus:outline-none focus:border-amber-500 bg-white transition-colors"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Amount (liters)</label>
            <input 
              type="number" 
              v-model.number="amount" 
              class="w-full border-2 border-slate-300 rounded-lg p-3 focus:outline-none focus:border-amber-500 transition-colors" 
              min="1" 
              placeholder="Enter amount in liters"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Coordinates [lng, lat]</label>
            <input 
              type="text" 
              v-model="coordsInput" 
              placeholder="e.g. 36.8219, -1.2921" 
              class="w-full border-2 border-slate-300 rounded-lg p-3 focus:outline-none focus:border-amber-500 transition-colors" 
            />
            <p class="text-xs text-slate-500 mt-1">Enter longitude and latitude separated by comma</p>
          </div>

          <button 
            type="submit" 
            class="w-full bg-amber-500 text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-amber-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Submit Request
          </button>
        </form>
      </div>

      <!-- List of Requests -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-indigo-600">
        <div class="bg-slate-900 px-6 py-4">
          <h2 class="text-xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 mr-2 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
            </svg>
            My Requests
          </h2>
        </div>

        <div class="p-6">
          <ul class="space-y-4">
            <li 
              v-for="req in fuelStore.requests" 
              :key="req._id" 
              class="border-2 border-slate-200 rounded-lg p-4 hover:border-amber-500 transition-colors"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <span class="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-bold mr-2">
                      {{ req.fuelType }}
                    </span>
                    <span class="bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                      {{ req.amount }}L
                    </span>
                  </div>
                  
                  <div class="space-y-1 text-sm">
                    <p class="flex items-center text-slate-600">
                      <span class="font-semibold mr-2">Status:</span>
                      <span 
                        class="px-2 py-1 rounded text-xs font-bold"
                        :class="{
                          'bg-yellow-100 text-yellow-800': req.status === 'pending',
                          'bg-green-100 text-green-800': req.status === 'completed',
                          'bg-blue-100 text-blue-800': req.status === 'in-progress',
                          'bg-red-100 text-red-800': req.status === 'cancelled'
                        }"
                      >
                        {{ req.status.toUpperCase() }}
                      </span>
                    </p>
                    <p class="text-slate-600">
                      <span class="font-semibold">Coordinates:</span> 
                      [{{ req.location.coordinates.join(", ") }}]
                    </p>
                    <p class="text-slate-500 text-xs">
                      {{ new Date(req.createdAt).toLocaleString() }}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <div 
            v-if="fuelStore.requests.length === 0" 
            class="text-center py-12"
          >
            <svg class="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p class="text-slate-400 font-medium">No requests yet.</p>
            <p class="text-slate-400 text-sm">Create your first fuel request above!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

