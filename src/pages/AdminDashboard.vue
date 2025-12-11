<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAdminFuelStore, Request } from "../stores/adminFuel";

const adminStore = useAdminFuelStore();

//  reactive state for the detail view/modal
const viewingDetails = ref<Request | null>(null);

onMounted(() => {
  adminStore.fetchAllRequests();
});

// Function to open/close the detail view
const viewDetails = (req: Request) => {
  viewingDetails.value = req;
};

const closeDetails = () => {
  viewingDetails.value = null;
};

// Update request status 
const handleUpdateStatus = async (status: "pending" | "delivered" | "cancelled") => {
  if (!viewingDetails.value) return;
  
  try {
    const id = viewingDetails.value._id;
    await adminStore.updateRequestStatus(id, status);
    
    viewingDetails.value.status = status; 
    
    alert(`Status updated to ${status.toUpperCase()}!`);
    // closeDetails(); 
  } catch (err: any) {
    alert(err);
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 py-8 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <div class="flex items-center mb-2">
          <div class="bg-indigo-600 p-2 rounded-lg mr-3">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p class="text-slate-600">Manage all fuel delivery requests</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-600">Pending</p>
              <p class="text-2xl font-bold text-slate-900">
                {{ adminStore.requests.filter(r => r.status === 'pending').length }}
              </p>
            </div>
            <div class="bg-yellow-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-600">Delivered</p>
              <p class="text-2xl font-bold text-slate-900">
                {{ adminStore.requests.filter(r => r.status === 'delivered').length }}
              </p>
            </div>
            <div class="bg-green-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-600">Cancelled</p>
              <p class="text-2xl font-bold text-slate-900">
                {{ adminStore.requests.filter(r => r.status === 'cancelled').length }}
              </p>
            </div>
            <div class="bg-red-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-5 border-l-4 border-amber-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-600">Total Requests</p>
              <p class="text-2xl font-bold text-slate-900">
                {{ adminStore.requests.length }}
              </p>
            </div>
            <div class="bg-amber-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-indigo-600">
        <div class="bg-slate-900 px-6 py-4">
          <h2 class="text-xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 mr-2 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            All Fuel Requests
          </h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  User
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Fuel Type
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Details / Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr 
                v-for="req in adminStore.requests" 
                :key="req._id"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="bg-indigo-100 rounded-full p-2 mr-3">
                      <svg class="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <span class="text-sm font-semibold text-slate-900">{{ req.user.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {{ req.user.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {{ req.fuelType }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                    {{ req.amount }}L
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-3 py-1 rounded-full text-xs font-bold"
                    :class="{
                      'bg-yellow-100 text-yellow-800': req.status === 'pending',
                      'bg-green-100 text-green-800': req.status === 'delivered',
                      'bg-red-100 text-red-800': req.status === 'cancelled'
                    }"
                  >
                    {{ req.status.toUpperCase() }}
                  </span>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-xs font-semibold flex items-center space-x-1"
                    @click="viewDetails(req)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM12 4.5c-4.418 0-8 3.358-8 7.5s3.582 7.5 8 7.5 8-3.358 8-7.5-3.582-7.5-8-7.5zM12 18c-3.1 0-5.75-1.93-7.07-4.5h14.14c-1.32 2.57-3.97 4.5-7.07 4.5zM12 6c3.1 0 5.75 1.93 7.07 4.5H4.93C6.25 7.93 8.9 6 12 6z" /></svg>
                    <span>View Details</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div 
          v-if="adminStore.requests.length === 0" 
          class="text-center py-12"
        >
          <svg class="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-slate-400 font-medium">No requests yet.</p>
          <p class="text-slate-400 text-sm">Fuel requests will appear here once users submit them.</p>
        </div>
      </div>
      <div v-if="viewingDetails" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all">
          <h3 class="text-xl font-bold text-slate-900 mb-4 border-b pb-2 flex justify-between items-center">
            Request Details ({{ viewingDetails._id.substring(0, 8) }}...)
            <button @click="closeDetails" class="text-slate-500 hover:text-slate-800">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </h3>
          
          <div class="space-y-3 mb-6">
            <p><strong class="text-slate-700">Client:</strong> {{ viewingDetails.user.name }} ({{ viewingDetails.user.email }})</p>
            <p><strong class="text-slate-700">Fuel Type:</strong> <span class="font-bold">{{ viewingDetails.fuelType }}</span></p>
            <p><strong class="text-slate-700">Amount:</strong> <span class="text-lg font-bold text-amber-600">{{ viewingDetails.amount }}L</span></p>
            <p><strong class="text-slate-700">Address:</strong> {{ viewingDetails.deliveryAddress || 'N/A' }}</p>
            <p><strong class="text-slate-700">Current Status:</strong> 
              <span 
                class="px-3 py-1 rounded-full text-xs font-bold"
                :class="{
                  'bg-yellow-100 text-yellow-800': viewingDetails.status === 'pending',
                  'bg-green-100 text-green-800': viewingDetails.status === 'delivered',
                  'bg-red-100 text-red-800': viewingDetails.status === 'cancelled'
                }"
              >
                {{ viewingDetails.status.toUpperCase() }}
              </span>
            </p>
            </div>

          <h4 class="text-lg font-bold text-slate-900 mb-3 border-t pt-4">Update Status</h4>
          
          <div class="flex flex-wrap gap-3">
            <button
              class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm font-semibold flex-1 min-w-[100px]"
              @click="handleUpdateStatus('pending')"
              :disabled="viewingDetails.status === 'pending'"
            >
              Set Pending
            </button>
            <button
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold flex-1 min-w-[100px]"
              @click="handleUpdateStatus('delivered')"
              :disabled="viewingDetails.status === 'delivered'"
            >
              Set Delivered
            </button>
            <button
              class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold flex-1 min-w-[100px]"
              @click="handleUpdateStatus('cancelled')"
              :disabled="viewingDetails.status === 'cancelled'"
            >
              Set Cancelled
            </button>
          </div>
        </div>
      </div>
      </div>
  </div>
</template>

