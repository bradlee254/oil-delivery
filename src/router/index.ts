import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Pages
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Dashboard from "../pages/Dashboard.vue";
import AdminDashboard from "../pages/AdminDashboard.vue";
import RiderDashboard from "../pages/RiderDashboard.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", component: Login, meta: { guest: true } },
  { path: "/register", component: Register, meta: { guest: true } },

  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },

  {
    path: "/admin",
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  {
    path: "/rider",
    component: RiderDashboard,
    meta: { requiresAuth: true, requiresRider: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async(to, from, next) => {
  const auth = useAuthStore();

  if (auth.token && !auth.user) {
    auth.init();
  }

  const isLoggedIn = !!auth.token;
  const role = auth.user?.role;
  console.log("Navigating to:", to.fullPath, "User role:", role);

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next("/");
  }

  
  if (to.meta.requiresAdmin && role !== "admin") {
    return next("/dashboard");
  }

  
  if (to.meta.requiresRider && role !== "rider") {
    return next("/dashboard");
  }

  // Guest pages
  if (to.meta.guest && isLoggedIn) {
    if (role === "admin") return next("/admin");
    if (role === "rider") return next("/rider");
    return next("/dashboard");
  }

  next();
});

export default router;
