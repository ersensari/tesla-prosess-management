<template>
  <a-layout class="main-layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      width="300"
    >
      <div class="logo">
        <img
          src="/img/tesla-logo.png"
          alt="Tesla Kontrol Sistemleri"
          class="vertical fade-in"
          v-if="collapsed"
        />
        <img
          src="/img/tesla-big-logo.png"
          alt="Tesla Kontrol Sistemleri"
          class="fade-in"
          v-else
        />
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
      >
        <a-menu-item key="1">
          <DashboardOutlined />
          <span>Gösterge Paneli</span>
        </a-menu-item>
        <a-menu-item key="2">
          <FilterOutlined />
          <span>Hammaddeler</span>
        </a-menu-item>
        <a-menu-item key="3">
          <ClusterOutlined />
          <span>Silo Tanımlama</span>
        </a-menu-item>
        <a-menu-item key="4">
          <ReconciliationOutlined />
          <span>Formüller</span>
        </a-menu-item>
        <a-menu-item key="5">
          <FireOutlined />
          <span>Üretim</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <ContainerOutlined />
              <span>Raporlar</span>
            </span>
          </template>
          <a-menu-item key="6">
            <ProfileOutlined />
            <span> Üretim Raporu</span></a-menu-item
          >
          <a-menu-item key="7">
            <ProfileOutlined />
            <span> Temel Üretim Raporu</span></a-menu-item
          >
          <a-menu-item key="8">
            <ProfileOutlined />
            <span> Detaylı Üretim Raporu</span>
          </a-menu-item>
          <a-menu-item key="9">
            <ProfileOutlined />
            <span> Tüketilen Hammadde Raporu</span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout class="ant-layout">
      <a-layout-header class="layout-header">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <h1>{{ pageName }}</h1>
        <a-menu mode="horizontal" v-if="user">
          <a-sub-menu>
            <template #title>
              <span class="submenu-title-wrapper">
                <UserOutlined />
                {{ user.firstName }} {{ user.lastName }}
              </span>
            </template>
            <a-menu-item key="setting:1">Şifre Değiştir</a-menu-item>
            <a-menu-item key="setting:2" @click="onLogoutClick"
              >Çıkış</a-menu-item
            >
          </a-sub-menu>
        </a-menu>
      </a-layout-header>
      <a-layout-content class="layout-content">
        <router-view v-slot="{ Component }">
          <keep-alive
            include="FlatProduction,DetailedProduction,BasicProduction,ConsumedRawMaterial"
          >
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { Layout, Menu } from "ant-design-vue";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AppstoreOutlined,
  ProfileOutlined,
  BuildOutlined,
  DashboardOutlined,
  ReconciliationOutlined,
  FireOutlined,
  ContainerOutlined,
  FilterOutlined,
  ClusterOutlined,
} from "@ant-design/icons-vue";
import { computed, defineComponent, inject, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useState, useActions, useMutations } from "@/store/hooks";
export default defineComponent({
  components: {
    "a-layout": Layout,
    "a-layout-sider": Layout.Sider,
    "a-layout-header": Layout.Header,
    "a-layout-content": Layout.Content,
    "a-layout-footer": Layout.Footer,
    "a-menu": Menu,
    "a-sub-menu": Menu.SubMenu,
    "a-menu-item": Menu.Item,
    "a-menu-item-group": Menu.ItemGroup,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    AppstoreOutlined,
    ProfileOutlined,
    BuildOutlined,
    DashboardOutlined,
    ReconciliationOutlined,
    FireOutlined,
    ContainerOutlined,
    FilterOutlined,
    ClusterOutlined,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { user } = useState(["user"], "auth");
    const pageKey = inject("pageKey", "1");

    const selectedKeys = ref([]);
    const openKeys = ref([""]);
    const collapsed = ref(false);

    const getRoute = (key) => {
      const route = router.getRoutes().find((r) => key === r.meta.key);
      return route;
    };

    const pageName = computed(() => {
      const r = getRoute(pageKey.value).meta.title;
      return r;
    });

    watch(selectedKeys, function (val) {
      const route = getRoute(val[0]);
      if (route) {
        router.push(route);
      }
    });

    watch(pageKey, (val) => {
      //selectedKeys.value = [];
      selectedKeys.value.push(val ? val.split("-")[0] : "1");
    });

    const { logout } = useActions(["logout"], "auth");

    return {
      selectedKeys,
      openKeys,
      collapsed,
      user,
      onLogoutClick: logout,
      pageName,
      pageKey,
      route,
    };
  },
});
</script>
