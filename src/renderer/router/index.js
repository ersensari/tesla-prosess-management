import { useState } from "@/store/hooks";
import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home";

const routes = [
  {
    path: "/access-denied",
    name: "access-denied",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/user/AccessDenied.vue"),
    meta: {
      roles: {
        viewers: ["all"],
      },
    },
  },
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
    path: "/production/process/:id/:batchNumber?",
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
  {
    path: "/reports/flat-production",
    name: "reports-flat-production",
    component: () =>
      import(
        /* webpackChunkName: "reports-flat-production" */ "../views/reports/FlatProduction"
      ),
    meta: {
      key: "6",
      title: "Üretim Raporu",
      roles: {
        viewers: ["admin", "supervizor", "operator", "manager"],
      },
    },
  },
  {
    path: "/reports/basic-production",
    name: "reports-basic-production",
    component: () =>
      import(
        /* webpackChunkName: "reports-basic-production" */ "../views/reports/BasicProduction"
      ),
    meta: {
      key: "7",
      title: "Temel Üretim Raporu",
      roles: {
        viewers: ["admin", "supervizor", "operator", "manager"],
      },
    },
  },
  {
    path: "/reports/detailed-production",
    name: "reports-detailed-production",
    component: () =>
      import(
        /* webpackChunkName: "reports-detailed-production" */ "../views/reports/DetailedProduction"
      ),
    meta: {
      key: "8",
      title: "Detaylı Üretim Raporu",
      roles: {
        viewers: ["admin", "supervizor", "operator", "manager"],
      },
    },
  },
  {
    path: "/reports/consumed-raw-material",
    name: "reports-consumed-raw-material",
    component: () =>
      import(
        /* webpackChunkName: "consumed-raw-material" */ "../views/reports/ConsumedRawMaterial"
      ),
    meta: {
      key: "9",
      title: "Tüketilen Hammadde Raporu",
      roles: {
        viewers: ["admin", "supervizor", "operator", "manager"],
      },
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(), //createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
