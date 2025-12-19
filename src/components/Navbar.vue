<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const isLoggedIn = computed(() => !!auth.token);
const isAdmin = computed(() => auth.user?.role === "admin");

const logoutUser = () => {
  auth.logout();
  router.push("/");
};
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 w-full bg-slate-900 text-white px-4 md:px-8 py-3 shadow-lg border-b-4 border-amber-500">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      
      <router-link to="/" class="flex items-center space-x-3 hover:opacity-90 transition-opacity">
        <div class="bg-amber-500 p-2 rounded-lg">
          <svg class="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
          </svg>
        </div>
        <div class="hidden sm:block"> <div class="font-bold text-lg md:text-xl tracking-tight leading-none">Fuel Delivery</div>
          <div class="text-[10px] uppercase tracking-widest text-slate-400">Fast & Reliable</div>
        </div>
      </router-link>

      <div class="flex items-center space-x-2 md:space-x-4">
        <router-link
          v-if="isLoggedIn && !isAdmin"
          to="/dashboard"
          active-class="bg-slate-700"
          class="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-200 text-sm md:text-base font-medium"
        >
          Dashboard
        </router-link>
        
        <router-link
          v-if="isLoggedIn && isAdmin"
          to="/admin"
          active-class="ring-2 ring-white"
          class="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 text-sm md:text-base font-medium"
        >
          Admin
        </router-link>
        
        <template v-if="!isLoggedIn">
          <router-link 
            to="/" 
            class="px-3 py-2 rounded-lg hover:bg-slate-800 transition-all duration-200 text-sm md:text-base font-medium"
          >
            Login
          </router-link>
          
          <router-link 
            to="/register" 
            class="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 transition-all duration-200 text-sm md:text-base font-bold shadow-md"
          >
            Register
          </router-link>
        </template>
        
        <button
          v-if="isLoggedIn"
          @click="logoutUser"
          class="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 text-sm md:text-base font-medium shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>

  <div class="h-20"></div>
</template>