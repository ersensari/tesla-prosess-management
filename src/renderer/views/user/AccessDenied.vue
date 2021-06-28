<template>
  <a-result
    status="403"
    title="Yetki Hatası! "
    sub-title="Ulaşmaya çalıştığınız sayfaya erişim yetkiniz bulunmamaktadır."
  >
  </a-result>
</template>

<script>
import { Result } from "ant-design-vue";
export default {
  name: "AccessDenied",
  components: {
    "a-result": Result,
  },
};
</script>

<style></style>
