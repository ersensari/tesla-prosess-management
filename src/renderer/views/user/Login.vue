<template>
  <a-layout class="main-layout">
    <a-layout-content class="login-content">
      <div class="shadowed-box">
        <div
          style="
            display: flex;
            align-items: center;
            flex-flow: column;
            margin-bottom: 2rem;
          "
        >
          <img
            src="/img/tesla-big-logo.png"
            alt="Tesla Üretim Yönetim Sistemi"
            style="width: 420px; margin-bottom: 1rem"
          />
          <h1>Üretim Yönetim Sistemi</h1>
        </div>

        <a-form
          :model="formState"
          @finish="handleLogin(formState)"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 14 }"
        >
          <a-form-item label="Kullanıcı Adı">
            <a-input
              v-model:value="formState.username"
              placeholder="Kullanıcı Adı"
            >
              <template #prefix
                ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
              /></template>
            </a-input>
          </a-form-item>
          <a-form-item label="Şifre">
            <a-input
              v-model:value="formState.password"
              type="password"
              placeholder="Şifre"
            >
              <template #prefix
                ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
              /></template>
            </a-input>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 7 }">
            <a-button
              type="primary"
              html-type="submit"
              :disabled="formState.username === '' || formState.password === ''"
            >
              Giriş
            </a-button>
          </a-form-item>
        </a-form>
        <a-alert
          class="fade-in"
          :message="error.message"
          type="error"
          v-if="error && !authenticating"
        />
        <a-alert
          class="fade-in"
          message="Giriş Başarılı"
          type="success"
          v-else-if="token && !authenticating"
        />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { Spin, Alert, Layout, Form, Input, Button } from "ant-design-vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { useState, useActions, useMutations } from "@/store/hooks";
import { reactive, defineComponent, toRaw, toRef } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    "a-spin": Spin,
    "a-alert": Alert,
    "a-layout": Layout,
    "a-layout-content": Layout.Content,
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-input": Input,
    "a-button": Button,
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const { token, error, authenticating } = useState(
      ["token", "error", "authenticating"],
      "auth"
    );

    const { setError } = useMutations(["setError"], "auth");

    const { login } = useActions(["login"], "auth");

    const router = useRouter();

    const formState = reactive({
      username: "",
      password: "",
    });

    const handleLogin = (values) => {
      setError(undefined);
      login(toRaw(values))
        .then((token) => {
          router.push({ name: "home" });
        })
        .catch((err) => {
          console.log(err);
        });
    };

    return {
      token,
      error,
      authenticating,
      formState,
      handleLogin,
    };
  },
});
</script>

<style lang="scss" scoped>
.login-content {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
