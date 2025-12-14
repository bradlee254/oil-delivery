<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useAdminFuelStore, Request, Rider } from "../stores/adminFuel"; // Added Rider type for clarity

// Initialize Pinia store
const adminStore = useAdminFuelStore();

// State for rider assignment
const selectRider = ref("");

// State for modal
const viewingDetails = ref<Request | null>(null);

// State for filtering and searching
const search = ref("");
const statusFilter = ref<"all" | "pending" | "delivered" | "cancelled">("all");

// Fetch data on component mount
onMounted(() => {
  adminStore.fetchAllRequests();
  adminStore.fetchRiders();
});

// Computed property for filtered requests
const filteredRequests = computed(() => {
  return adminStore.requests.filter((r) => {
    // Search filter
    const matchesSearch =
      r.user.name.toLowerCase().includes(search.value.toLowerCase()) ||
      r.user.email.toLowerCase().includes(search.value.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter.value === "all" || r.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

// Function to assign a rider
const assignRider = async () => {
  if (!viewingDetails.value || !selectRider.value) return;

  try {
    await adminStore.assignRider(
      viewingDetails.value._id,
      selectRider.value
    );
    alert("Rider assigned successfully");
    // Optionally update the request with the assigned rider name for immediate UI feedback (if available)
    // viewingDetails.value.assignedRiderName = adminStore.riders.find(r => r._id === selectRider.value)?.name || "";
    selectRider.value = "";
  } catch (err) {
    alert("Failed to assign rider");
  }
};

// Functions to manage modal
const viewDetails = (req: Request) => {
  viewingDetails.value = req;
};

const closeDetails = () => {
  viewingDetails.value = null;
  selectRider.value = ""; // Reset selected rider when closing
};

// Function to update request status
const handleUpdateStatus = async (
  status: "pending" | "delivered" | "cancelled"
) => {
  if (!viewingDetails.value) return;

  try {
    const id = viewingDetails.value._id;
    await adminStore.updateRequestStatus(id, status);
    // Update local state to reflect change immediately
    viewingDetails.value.status = status;
    alert(`Status updated to ${status}`);
  } catch (err: any) {
    alert(err?.message || "Failed to update status");
  }
};

// Helper for status badge classes
const getStatusClasses = (status: "pending" | "delivered" | "cancelled") => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 ring-yellow-600/20';
    case 'delivered':
      return 'bg-green-100 text-green-700 ring-green-600/20';
    case 'cancelled':
      return 'bg-red-100 text-red-700 ring-red-600/20';
    default:
      return '';
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
    <div class="max-w-7xl mx-auto">

      <header class="mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">⛽ Admin Dashboard</h1>
        <p class="text-gray-500 mt-1">Manage and track all fuel delivery requests efficiently.</p>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-5 rounded-xl shadow-lg border-l-4 border-yellow-500 transition duration-300 hover:shadow-xl">
          <p class="text-sm font-medium text-gray-500">Pending Requests</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">
            {{ adminStore.requests.filter(r => r.status === "pending").length }}
          </p>
        </div>

        <div class="bg-white p-5 rounded-xl shadow-lg border-l-4 border-green-500 transition duration-300 hover:shadow-xl">
          <p class="text-sm font-medium text-gray-500">Delivered Requests</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">
            {{ adminStore.requests.filter(r => r.status === "delivered").length }}
          </p>
        </div>

        <div class="bg-white p-5 rounded-xl shadow-lg border-l-4 border-red-500 transition duration-300 hover:shadow-xl">
          <p class="text-sm font-medium text-gray-500">Cancelled Requests</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">
            {{ adminStore.requests.filter(r => r.status === "cancelled").length }}
          </p>
        </div>

        <div class="bg-white p-5 rounded-xl shadow-lg border-l-4 border-indigo-500 transition duration-300 hover:shadow-xl">
          <p class="text-sm font-medium text-gray-500">Total Requests</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">
            {{ adminStore.requests.length }}
          </p>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <input
          v-model="search"
          placeholder="Search by user name or email..."
          class="border border-gray-300 rounded-lg px-4 py-2.5 w-full md:w-1/3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        />

        <select
          v-model="statusFilter"
          class="border border-gray-300 rounded-lg px-4 py-2.5 w-full md:w-1/4 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div v-if="adminStore.loading" class="text-center py-12 text-indigo-600 font-medium">
        <svg class="animate-spin h-5 w-5 mr-3 inline text-indigo-500" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading requests...
      </div>

      <div v-if="adminStore.error" class="text-center py-12 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong class="font-bold">Error:</strong>
        <span class="block sm:inline">{{ adminStore.error }}</span>
      </div>

      <div v-if="!adminStore.loading" class="bg-white rounded-xl shadow-lg overflow-hidden ring-1 ring-gray-200">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                    <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">User</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Fuel Type</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-200">
                    <tr
                    v-for="req in filteredRequests"
                    :key="req._id"
                    class="hover:bg-gray-50 transition duration-150"
                    >
                    <td class="px-6 py-4 font-medium text-gray-900">{{ req.user.name }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ req.user.email }}</td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                        {{ req.fuelType }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-semibold">{{ req.amount }} L</td>
                    <td class="px-6 py-4">
                        <span
                        class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase ring-1 ring-inset"
                        :class="getStatusClasses(req.status)"
                        >
                        {{ req.status }}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <button
                        class="text-indigo-600 hover:text-indigo-900 font-medium text-sm transition duration-150"
                        @click="viewDetails(req)"
                        >
                        View Details
                        </button>
                    </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="filteredRequests.length === 0" class="py-10 text-center text-gray-400 font-medium">
          No matching requests found.
        </div>
      </div>
    </div>

    <Transition name="fade">
        <div
        v-if="viewingDetails"
        class="fixed inset-0 **backdrop-blur-sm bg-black/30** flex items-center justify-center p-4 z-50 transition-opacity"
        @click.self="closeDetails"
        >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all scale-100">
            <div class="flex justify-between items-start pb-4 border-b border-gray-200 mb-4">
            <h3 class="font-bold text-xl text-gray-900">Request Details - {{ viewingDetails.user.name }}</h3>
            <button @click="closeDetails" class="text-gray-400 hover:text-gray-600 transition duration-150">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            </div>

            <div class="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
                <p class="text-sm"><strong class="font-semibold text-gray-700">Name:</strong> {{ viewingDetails.user.name }}</p>
                <p class="text-sm"><strong class="font-semibold text-gray-700">Email:</strong> {{ viewingDetails.user.email }}</p>
                <p class="text-sm"><strong class="font-semibold text-gray-700">Fuel:</strong> <span class="font-medium text-indigo-600">{{ viewingDetails.fuelType }}</span></p>
                <p class="text-sm"><strong class="font-semibold text-gray-700">Amount:</strong> <span class="font-medium text-gray-900">{{ viewingDetails.amount }} L</span></p>
                <p class="text-sm"><strong class="font-semibold text-gray-700">Address:</strong> {{ viewingDetails.deliveryAddress || "N/A" }}</p>
                <p class="text-sm"><strong class="font-semibold text-gray-700">Current Status:</strong> 
                    <span
                        class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase ring-1 ring-inset ml-2"
                        :class="getStatusClasses(viewingDetails.status)"
                    >
                    {{ viewingDetails.status }}
                    </span>
                </p>
            </div>

            <div class="mb-6">
                <h4 class="text-md font-bold text-gray-700 mb-2 border-b pb-1">Update Status</h4>
                <div class="flex gap-3">
                    <button
                        class="py-2 px-4 rounded-lg flex-1 text-sm font-semibold transition duration-150"
                        :class="viewingDetails.status === 'pending' ? 'bg-yellow-500 text-white cursor-not-allowed opacity-70' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-500 hover:text-white'"
                        @click="handleUpdateStatus('pending')"
                        :disabled="viewingDetails.status === 'pending'"
                    >
                        Pending
                    </button>
                    <button
                        class="py-2 px-4 rounded-lg flex-1 text-sm font-semibold transition duration-150"
                        :class="viewingDetails.status === 'delivered' ? 'bg-green-600 text-white cursor-not-allowed opacity-70' : 'bg-green-100 text-green-800 hover:bg-green-600 hover:text-white'"
                        @click="handleUpdateStatus('delivered')"
                        :disabled="viewingDetails.status === 'delivered'"
                    >
                        Delivered
                    </button>
                    <button
                        class="py-2 px-4 rounded-lg flex-1 text-sm font-semibold transition duration-150"
                        :class="viewingDetails.status === 'cancelled' ? 'bg-red-600 text-white cursor-not-allowed opacity-70' : 'bg-red-100 text-red-800 hover:bg-red-600 hover:text-white'"
                        @click="handleUpdateStatus('cancelled')"
                        :disabled="viewingDetails.status === 'cancelled'"
                    >
                        Cancelled
                    </button>
                </div>
            </div>

            <div>
                <h4 class="text-md font-bold text-gray-700 mb-2 border-b pb-1">Assign Rider</h4>
                <select v-model="selectRider" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                <option value="">Select an available rider</option>
                <option v-for="rider in adminStore.riders" :key="rider._id" :value="rider._id">
                    {{ rider.name }} ({{ rider.phone }})
                </option>
                </select>
                <button
                class="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold text-sm transition duration-150"
                :class="!selectRider ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'"
                :disabled="!selectRider"
                @click="assignRider"
                >
                Assign Rider
                </button>
            </div>
        </div>
        </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Basic fade transition for the modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>