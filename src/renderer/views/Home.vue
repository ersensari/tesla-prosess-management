<template>
  <a-spin size="large" :spinning="authenticating">
    <div class="home">
      <button @click="onLoginClicked({ username: 'admin', password: 'tesla' })">
        Login
      </button>
      <a-alert
        :message="error.message"
        type="error"
        v-if="error && !authenticating"
      />
      <a-alert
        message="login success"
        type="success"
        v-else-if="token && !authenticating"
      />
    </div>
  </a-spin>
</template>

<script>
import { useState, useActions } from "@/store/hooks";
import { Spin, Alert } from "ant-design-vue";
export default {
  name: "Home",
  components: {
    "a-alert": Alert,
    "a-spin": Spin,
  },
  setup() {
    const { token, error, authenticating } = useState(
      ["token", "error", "authenticating"],
      "auth"
    );

    const { login } = useActions(["login"], "auth");

    const onLoginClicked = function (form) {
      login(form);
    };
    return {
      token,
      error,
      authenticating,
      onLoginClicked,
    };
  },
};
</script>
