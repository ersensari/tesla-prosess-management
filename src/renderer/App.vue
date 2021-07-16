<template>
  <layout v-if="token" />
  <login v-else />
</template>

<script>
import Layout from "@/views/Layout";
import Login from "@/views/user/Login";
import { useState } from "@/store/hooks";
import { provide, ref, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  components: {
    Layout,
    Login,
  },
  setup() {
    const { token, user } = useState(["token", "user"], "auth");
    const route = useRoute();
    const router = useRouter();
    const pageKey = ref("1");
    provide("pageKey", pageKey);
    watch(
      () => route.meta,
      async (meta) => {
        pageKey.value = meta.key;
      }
    );

    router.beforeEach((to, from, next) => {
      const roles = to.meta.roles.modifiers
        ? to.meta.roles.viewers.concat(to.meta.roles.modifiers)
        : to.meta.roles.viewers;

      if (
        token &&
        user.value.role !== "admin" &&
        !roles.includes("all") &&
        !roles.includes(user.value.role)
      ) {
        next({ name: "access-denied" });
      } else next();
    });

    onUnmounted(() => {
      localStorage.removeItem("tesla-storage");
    });

    return {
      token,
    };
  },
};
</script>
