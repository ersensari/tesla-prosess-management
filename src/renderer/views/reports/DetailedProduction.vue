<template>
  <div class="about">
    <h1>Detaylı Üretim Raporu</h1>
  </div>
</template>
<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "DetailedProduction",
  setup() {
    const route = useRoute();

    const state = reactive({
      pageName: route.name,
    });

    return {
      state,
    };
  },
});
</script>
