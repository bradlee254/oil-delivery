
<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

// Computed properties for convenience
const isLoggedIn = computed(() => !!auth.token);
const isAdmin = computed(() => auth.user?.role === "admin");

// Logout function
const logoutUser = () => {
  auth.logout();
  router.push("/");
};
</script>
<template>
  <nav class="bg-slate-900 text-white px-8 py-4 shadow-lg border-b-4 border-amber-500 top-0 fixed z-10 w-full bottom-auto">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <!-- Logo/Brand -->
      <div class="flex items-center space-x-3">
        <div class="bg-amber-500 p-2 rounded-lg">
          <svg class="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
          </svg>
        </div>
        <div>
          <div class="font-bold text-xl tracking-tight">Fuel Delivery</div>
          <div class="text-xs text-slate-400">Fast & Reliable</div>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="flex items-center space-x-2">
        <router-link
          v-if="isLoggedIn && !isAdmin"
          to="/dashboard"
          class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-200 font-medium"
        >
          Dashboard
        </router-link>
        
        <router-link
          v-if="isLoggedIn && isAdmin"
          to="/admin"
          class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 font-medium"
        >
          Admin Dashboard
        </router-link>
        
        <router-link 
          v-if="!isLoggedIn" 
          to="/" 
          class="px-4 py-2 rounded-lg hover:bg-slate-800 transition-all duration-200 font-medium"
        >
          Login
        </router-link>
        
        <router-link 
          v-if="!isLoggedIn" 
          to="/register" 
          class="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 transition-all duration-200 font-bold"
        >
          Register
        </router-link>
        
        <button
          v-if="isLoggedIn"
          @click="logoutUser"
          class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

