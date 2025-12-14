<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useAdminFuelStore, Request } from "../stores/adminFuel";

const adminStore = useAdminFuelStore();
const selectRider = ref("")

const viewingDetails = ref<Request | null>(null);
const search = ref("");
const statusFilter = ref<"all" | "pending" | "delivered" | "cancelled">("all");

onMounted(() => {
  adminStore.fetchAllRequests();
  adminStore.fetchRiders();
});

const filteredRequests = computed(() => {
  return adminStore.requests.filter((r) => {
    const matchesSearch =
      r.user.name.toLowerCase().includes(search.value.toLowerCase()) ||
      r.user.email.toLowerCase().includes(search.value.toLowerCase());

    const matchesStatus =
      statusFilter.value === "all" || r.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

const assignRider = async ()=>{
  if(!viewingDetails.value || !selectedRider.value ) return;
  try {
    await adminStore.assignRider(
      viewingDetails.value._id,
      selectedRider.value
    );
    alert("Rider assigned successfuly");
    selectedRider.value = ""
  }catch(err){
    alert("failed to assign rider")
  }
}

const viewDetails = (req: Request) => {
  viewingDetails.value = req;
};

const closeDetails = () => {
  viewingDetails.value = null;
};

const handleUpdateStatus = async (
  status: "pending" | "delivered" | "cancelled"
) => {
  if (!viewingDetails.value) return;

  try {
    const id = viewingDetails.value._id;
    await adminStore.updateRequestStatus(id, status);
    viewingDetails.value.status = status;
  } catch (err: any) {
    alert(err?.message || "Failed to update status");
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 px-6 py-8">
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p class="text-slate-600">Manage fuel delivery requests</p>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-5 rounded-lg shadow border-l-4 border-yellow-500">
          <p class="text-sm text-slate-500">Pending</p>
          <p class="text-2xl font-bold">
            {{ adminStore.requests.filter(r => r.status === "pending").length }}
          </p>
        </div>

        <div class="bg-white p-5 rounded-lg shadow border-l-4 border-green-500">
          <p class="text-sm text-slate-500">Delivered</p>
          <p class="text-2xl font-bold">
            {{ adminStore.requests.filter(r => r.status === "delivered").length }}
          </p>
        </div>

        <div class="bg-white p-5 rounded-lg shadow border-l-4 border-red-500">
          <p class="text-sm text-slate-500">Cancelled</p>
          <p class="text-2xl font-bold">
            {{ adminStore.requests.filter(r => r.status === "cancelled").length }}
          </p>
        </div>

        <div class="bg-white p-5 rounded-lg shadow border-l-4 border-indigo-500">
          <p class="text-sm text-slate-500">Total</p>
          <p class="text-2xl font-bold">
            {{ adminStore.requests.length }}
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-col md:flex-row gap-4 mb-4">
        <input
          v-model="search"
          placeholder="Search by name or email"
          class="border rounded-lg px-4 py-2 w-full md:w-1/3"
        />

        <select
          v-model="statusFilter"
          class="border rounded-lg px-4 py-2 w-full md:w-1/4"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <!-- Loading / Error -->
      <div v-if="adminStore.loading" class="text-center py-10 text-slate-500">
        Loading requests…
      </div>

      <div v-if="adminStore.error" class="text-center py-10 text-red-500">
        {{ adminStore.error }}
      </div>

      <!-- Table -->
      <div v-if="!adminStore.loading" class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-slate-100 border-b">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold">User</th>
              <th class="px-6 py-3 text-left text-xs font-bold">Email</th>
              <th class="px-6 py-3 text-left text-xs font-bold">Fuel</th>
              <th class="px-6 py-3 text-left text-xs font-bold">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-bold">Status</th>
              <th class="px-6 py-3 text-left text-xs font-bold">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y">
            <tr
              v-for="req in filteredRequests"
              :key="req._id"
              class="hover:bg-slate-50"
            >
              <td class="px-6 py-4 font-medium">{{ req.user.name }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ req.user.email }}</td>
              <td class="px-6 py-4">
                <span class="bg-slate-900 text-white px-2 py-1 rounded text-xs">
                  {{ req.fuelType }}
                </span>
              </td>
              <td class="px-6 py-4">{{ req.amount }}L</td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 rounded text-xs font-bold"
                  :class="{
                    'bg-yellow-100 text-yellow-800': req.status === 'pending',
                    'bg-green-100 text-green-800': req.status === 'delivered',
                    'bg-red-100 text-red-800': req.status === 'cancelled'
                  }"
                >
                  {{ req.status.toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button
                  class="bg-indigo-600 text-white px-3 py-2 rounded text-xs"
                  @click="viewDetails(req)"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredRequests.length === 0" class="py-10 text-center text-slate-400">
          No matching requests
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="viewingDetails"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg">Request Details</h3>
          <button @click="closeDetails">✕</button>
        </div>

        <div class="space-y-2 mb-4">
          <p><strong>Name:</strong> {{ viewingDetails.user.name }}</p>
          <p><strong>Email:</strong> {{ viewingDetails.user.email }}</p>
          <p><strong>Fuel:</strong> {{ viewingDetails.fuelType }}</p>
          <p><strong>Amount:</strong> {{ viewingDetails.amount }}L</p>
          <p><strong>Address:</strong> {{ viewingDetails.deliveryAddress || "N/A" }}</p>
        </div>

        <div class="flex gap-2">
          <button
            class="bg-yellow-500 text-white px-3 py-2 rounded flex-1"
            @click="handleUpdateStatus('pending')"
            :disabled="viewingDetails.status === 'pending'"
          >
            Pending
          </button>
          <button
            class="bg-green-500 text-white px-3 py-2 rounded flex-1"
            @click="handleUpdateStatus('delivered')"
            :disabled="viewingDetails.status === 'delivered'"
          >
            Delivered
          </button>
          <button
            class="bg-red-500 text-white px-3 py-2 rounded flex-1"
            @click="handleUpdateStatus('cancelled')"
            :disabled="viewingDetails.status === 'cancelled'"
          >
            Cancelled
          </button>
        </div>
      </div>
      <div class="mt-6 border-t pt-4">
        <h4 class="text-lg font-bold text-slate-900 mb-2">Assign Rider</h4>

        <select v-model="selectedRider" class="w-ful border rounded-lg px-3 py-2 text-sm">
          <option value="">Select available rider</option>
          <option v-for="rider in adminStore.riders" :key="rider._id" :value="rider._id">
            {{ rider.name }} ({{ rider.phone }})
          </option>
        </select>
        <button class="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm font-semibold"
        :disabled="!selectRider"
        @click="assignRider"> Assign Rider</button>
      </div>
    </div>
  </div>
</template>
