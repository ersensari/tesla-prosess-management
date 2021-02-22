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
          <span>Anasayfa</span>
        </a-menu-item>
        <a-menu-item key="2">
          <video-camera-outlined />
          <span>Hammaddeler</span>
        </a-menu-item>
        <a-menu-item key="3">
          <ReconciliationOutlined />
          <span>Formüller</span>
        </a-menu-item>
        <a-menu-item key="4">
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
          <a-menu-item key="5">
            <ProfileOutlined />
            <span> Temel Üretim Raporu</span></a-menu-item
          >
          <a-menu-item key="6">
            <ProfileOutlined />
            <span> Detaylı Üretim Raporu</span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
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
        <div class="profile" v-if="user">
          <span><UserOutlined /></span
          ><span>{{ user.firstName }} {{ user.lastName }}</span>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          height: '100%',
        }"
      >
        <router-view />
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
} from "@ant-design/icons-vue";
import { defineComponent, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useState } from "@/store/hooks";
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
  },
  setup() {
    const router = useRouter();
    const { user } = useState(["user"], "auth");
    const selectedKeys = ref(["1"]);
    const openKeys = ref([""]);
    const collapsed = ref(false);
    watch(selectedKeys, function (val) {
      const route = router.getRoutes().find((r) => r.meta.key === val[0]);
      if (route) router.push(route);
    });

    return {
      selectedKeys,
      openKeys,
      collapsed,
      user,
    };
  },
});
</script>
<style lang="scss">
html,
body {
  height: 100vh;
  margin: 0;
}
#app {
  height: 100%;
  width: 100%;

  .main-layout {
    height: 100%;
    width: 100%;
  }

  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  .trigger:hover {
    color: #1890ff;
  }

  .logo {
    height: 64px;
    background: rgba(255, 255, 255, 0.9);
    margin: 16px;
    justify-content: center;
    align-items: center;
    display: flex;
    .vertical {
      transform: rotate(-90deg);
      height: 16px;
    }
    img {
      height: 32px;
    }
  }

  .fade-in {
    animation: fadeIn ease 1s;
    -webkit-animation: fadeIn ease 1s;
    -moz-animation: fadeIn ease 1s;
    -o-animation: fadeIn ease 1s;
    -ms-animation: fadeIn ease 1s;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
