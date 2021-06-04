import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home";

//all routes need authentication
const routes = [
  {
    path: "/",
    component: Home,
    name: "home",
    meta: {
      key: "1",
      title: "Gösterge Paneli",
      roles: {
        viewers: ["all"],
      },
    },
  },
  {
    path: "/raw-materials",
    name: "raw-materials",
    component: () =>
      import(
        /* webpackChunkName: "raw-materials" */ "../views/RawMaterials.vue"
      ),
    meta: {
      key: "2",
      title: "Hammaddeler",
      roles: {
        modifiers: ["admin", "supervizor"],
        viewers: ["operator", "manager"],
      },
    },
  },
  {
    path: "/silos",
    name: "silos",
    component: () =>
      import(/* webpackChunkName: "silos" */ "../views/Silos.vue"),
    meta: {
      key: "3",
      title: "Silo Tanımları",
      roles: {
        modifiers: ["admin", "supervizor", "operator"],
        viewers: ["manager"],
      },
    },
  },

  {
    path: "/formulas",
    name: "formulas",
    component: () =>
      import(/* webpackChunkName: "formulas" */ "../views/Formulas.vue"),
    meta: {
      key: "4",
      title: "Formüller",
      roles: {
        modifiers: ["admin", "supervizor"],
        viewers: ["operator", "manager"],
      },
    },
  },
  {
    path: "/production",
    name: "production",
    component: () =>
      import(/* webpackChunkName: "production" */ "../views/production/Index"),
    meta: {
      key: "5",
      title: "Üretim",
      roles: {
        modifiers: ["admin", "supervizor", "operator"],
        viewers: ["manager"],
      },
    },
  },
  {
    path: "/production/process/:id",
    name: "production-process",
    component: () =>
      import(
        /* webpackChunkName: "production-process" */ "../views/production/Process"
      ),
    props: true,
    meta: {
      key: "5-6",
      title: "Üretim Süreç Takip",
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
