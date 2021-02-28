import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home";

//all routes need authentication
const routes = [
  {
    path: "/",
    name: "Gösterge Paneli",
    component: Home,
    meta: {
      key: "1",
      roles: {
        viewers: ["all"],
      },
    },
  },
  {
    path: "/raw-materials",
    name: "Hammaddeler",
    component: () =>
      import(
        /* webpackChunkName: "raw-materials" */ "../views/RawMaterials.vue"
      ),
    meta: {
      key: "2",
      roles: {
        modifiers: ["admin", "supervizor"],
        viewers: ["operator", "manager"],
      },
    },
  },
  {
    path: "/silos",
    name: "Silo Tanımları",
    component: () =>
      import(/* webpackChunkName: "silos" */ "../views/Silos.vue"),
    meta: {
      key: "3",
      roles: {
        modifiers: ["admin", "supervizor", "operator"],
        viewers: ["manager"],
      },
    },
  },

  {
    path: "/formulas",
    name: "Formüller",
    component: () =>
      import(/* webpackChunkName: "formulas" */ "../views/Formulas.vue"),
    meta: {
      key: "4",
      roles: {
        modifiers: ["admin", "supervizor"],
        viewers: ["operator", "manager"],
      },
    },
  },
  {
    path: "/production",
    name: "Üretim",
    component: () =>
      import(/* webpackChunkName: "production" */ "../views/Production.vue"),
    meta: {
      key: "5",
      roles: {
        modifiers: ["admin", "supervizor", "operator"],
        viewers: ["manager"],
      },
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(), //createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
