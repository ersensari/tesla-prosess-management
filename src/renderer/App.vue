<template>
  <layout v-if="token" />
  <login v-else />
</template>

<script>
import Layout from "@/views/Layout";
import Login from "@/views/user/Login";
import { useState } from "@/store/hooks";
import { provide, ref, watch } from "vue";
import { useRoute } from "vue-router";

export default {
  components: {
    Layout,
    Login,
  },
  setup() {
    const { token } = useState(["token"], "auth");
    const route = useRoute();
    const pageKey = ref("1");
    provide("pageKey", pageKey);
    watch(
      () => route.meta,
      async (meta) => {
        pageKey.value = meta.key;
      }
    );
    return {
      token,
    };
  },
};
</script>
