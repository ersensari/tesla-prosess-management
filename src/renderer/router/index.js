import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/access-denied',
    name: 'access-denied',
    component: () => import(/* webpackChunkName: "login" */ '../views/user/AccessDenied.vue'),
    meta: {
      roles: {
        viewers: ['all'],
      },
    },
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    name: 'home',
    meta: {
      key: '1',
      title: 'Gösterge Paneli',
      roles: {
        viewers: ['all'],
      },
    },
  },

  {
    path: '/raw-materials',
    name: 'raw-materials',
    component: () => import(/* webpackChunkName: "raw-materials" */ '../views/RawMaterials.vue'),
    meta: {
      key: '2',
      title: 'Hammaddeler',
      roles: {
        viewers: ['admin'],
      },
    },
  },
  {
    path: '/silos',
    name: 'silos',
    component: () => import(/* webpackChunkName: "silos" */ '../views/Silos.vue'),
    meta: {
      key: '3',
      title: 'Silo Tanımları',
      roles: {
        viewers: ['admin'],
      },
    },
  },

  {
    path: '/formulas',
    name: 'formulas',
    component: () => import(/* webpackChunkName: "formulas" */ '../views/Formulas.vue'),
    meta: {
      key: '4',
      title: 'Formüller',
      roles: {
        viewers: ['admin'],
      },
    },
  },
  {
    path: '/production',
    name: 'production',
    component: () => import(/* webpackChunkName: "production" */ '../views/production/Index'),
    meta: {
      key: '5',
      title: 'Üretim',
      roles: {
        viewers: ['admin', 'operator'],
      },
    },
  },
  {
    path: '/production/process/:id/:batchNumber?',
    name: 'production-process',
    component: () => import(/* webpackChunkName: "production-process" */ '../views/production/Process'),
    props: true,
    meta: {
      key: '5-6',
      title: 'Üretim Süreç Takip',
      roles: {
        viewers: ['admin', 'operator'],
      },
    },
  },
  {
    path: '/reports/flat-production',
    name: 'reports-flat-production',
    component: () => import(/* webpackChunkName: "reports-flat-production" */ '../views/reports/FlatProduction'),
    meta: {
      key: '6',
      title: 'Üretim Raporu',
      roles: {
        viewers: ['admin', 'kalitekontrol', 'operator'],
      },
    },
  },
  {
    path: '/reports/basic-production',
    name: 'reports-basic-production',
    component: () => import(/* webpackChunkName: "reports-basic-production" */ '../views/reports/BasicProduction'),
    meta: {
      key: '7',
      title: 'Temel Üretim Raporu',
      roles: {
        viewers: ['admin', 'kalitekontrol', 'operator'],
      },
    },
  },
  {
    path: '/reports/detailed-production',
    name: 'reports-detailed-production',
    component: () => import(/* webpackChunkName: "reports-detailed-production" */ '../views/reports/DetailedProduction'),
    meta: {
      key: '8',
      title: 'Detaylı Üretim Raporu',
      roles: {
        viewers: ['admin', 'kalitekontrol', 'operator'],
      },
    },
  },
  {
    path: '/reports/consumed-raw-material',
    name: 'reports-consumed-raw-material',
    component: () => import(/* webpackChunkName: "consumed-raw-material" */ '../views/reports/ConsumedRawMaterial'),
    meta: {
      key: '9',
      title: 'Tüketilen Hammadde Raporu',
      roles: {
        viewers: ['admin', 'kalitekontrol', 'operator'],
      },
    },
  },
  {
    path: '/user/user-management',
    name: 'user-management',
    component: () => import(/* webpackChunkName: "user-management" */ '../views/user/UserManagement'),
    meta: {
      key: '10',
      title: 'Kullanıcı Yönetimi',
      roles: {
        viewers: ['admin'],
      },
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(), //createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
