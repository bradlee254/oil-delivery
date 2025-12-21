<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const name = ref("");
const email = ref("");
const password = ref("");
const auth = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
  try {
    await auth.register(name.value, auth.selectedRole, email.value, password.value);
    // Redirect based on role
    if (auth.user?.role === "admin") {
      router.push("/admin");
    } 
    else if (auth.user?.role === "rider") {
      router.push("/rider");
    }
    else {
      router.push("/dashboard");
    }
  } catch (err: any) {
    alert(err.response?.data?.message || "Registration failed");
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100 px-6 py-12">
    <div class="w-full max-w-md">
      <!-- Logo/Brand Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center bg-amber-500 p-4 rounded-2xl shadow-lg mb-4">
          <svg class="w-12 h-12 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
        <p class="text-slate-600">Join Oil Delivery today</p>
      </div>

      <!-- Register Card -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-amber-500">
        <div class="p-8">
          <form @submit.prevent="handleRegister" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  v-model="name"
                  type="text"
                  placeholder="Enter your full name"
                  class="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  v-model="email"
                  type="email"
                  placeholder="Enter your email"
                  class="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font font-semibold text-slate-700 mb-2">
                Role
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <select
                  v-model="auth.selectedRole"
                  class="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                  required
                >
                  <option value="" disabled>Select your role</option>
                  <option value="customer">Customer</option>
                  <option value="rider">Rider</option>
                </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  v-model="password"
                  type="password"
                  placeholder="Create a strong password"
                  class="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>
              <p class="mt-1 text-xs text-slate-500">
                Use at least 8 characters with a mix of letters and numbers
              </p>
            </div>

            <button
              type="submit"
              class="w-full bg-amber-500 text-slate-900 py-3 rounded-lg font-bold hover:bg-amber-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Create Account
            </button>
          </form>
        </div>

        <!-- Login Link -->
        <div class="bg-slate-50 px-8 py-4 border-t border-slate-200">
          <p class="text-center text-sm text-slate-600">
            Already have an account?
            <router-link 
              to="/" 
              class="text-amber-600 font-semibold hover:text-amber-700 ml-1"
            >
              Sign In
            </router-link>
          </p>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="mt-6 text-center">
        <p class="text-xs text-slate-500">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  </div>
</template>

