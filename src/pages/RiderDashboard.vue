<script setup lang="ts">
import { onMounted } from "vue";
import { useRiderStore } from "../stores/riderStore";

const riderStore = useRiderStore();

onMounted(() => {
  riderStore.fetchMyAssignments();
});

const completeDelivery = async (id: string) => {
  await riderStore.markDelivered(id);
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Rider Dashboard</h1>

    <div v-if="riderStore.loading">Loading assignments...</div>
    <div v-if="riderStore.error" class="text-red-500">
      {{ riderStore.error }}
    </div>

    <div v-if="!riderStore.loading && riderStore.requests.length === 0">
      No active deliveries. Enjoy the calm while it lasts.
    </div>

    <div
      v-for="req in riderStore.requests"
      :key="req._id"
      class="border rounded p-4 mb-4"
    >
      <p><strong>Client:</strong> {{ req.user.name }} ({{ req.user.email }})</p>
      <p><strong>Fuel:</strong> {{ req.fuelType }} – {{ req.amount }}L</p>
      <p><strong>Status:</strong> {{ req.status }}</p>
      <p>
        <strong>Coordinates:</strong>
        {{ req.location.coordinates.join(", ") }}
      </p>

      <button
        v-if="req.status === 'pending'"
        @click="completeDelivery(req._id)"
        class="mt-3 px-4 py-2 bg-green-600 text-white rounded"
      >
        Mark as Delivered
      </button>
    </div>
  </div>
</template>
