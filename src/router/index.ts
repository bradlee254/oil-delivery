import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Pages
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Dashboard from "../pages/Dashboard.vue";
import AdminDashboard from "../pages/AdminDashboard.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", component: Login, meta: { guest: true } },
  { path: "/register", component: Register, meta: { guest: true } },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/admin", component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // Initialize Axios header if token exists
  if (auth.token && !auth.user) {
    auth.init(); // ensure Authorization header is set
  }

  const isLoggedIn = !!auth.token;
  const isAdmin = auth.user?.role === "admin";

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next("/");
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return next("/dashboard");
  }

  if (to.meta.guest && isLoggedIn) {
    return next("/dashboard");
  }

  next();
});

export default router;
