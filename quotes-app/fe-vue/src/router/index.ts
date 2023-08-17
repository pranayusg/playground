import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/components/HomeComp/HomeView.vue";
import NotFound from "@/components/404.vue";
import { auth } from "@/utils/authHelpers";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "homeView",
    component: HomeView,
  },
  {
    path: "/userdetails",
    name: "userDetails",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../components/UserDetails/UserView.vue"),
    beforeEnter: (to, from, next) => {
      // Per Route Guard
      if (auth.isLoggedIn()) next();
      else next("/");
    },
  },
  { path: "/:catchAll(.*)", name: "notFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
