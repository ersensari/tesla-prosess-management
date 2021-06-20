<template>
  <div style="height: 100%">
    <prod-list v-if="!editMode && !newMode"></prod-list>
    <select-formula v-else-if="newMode && !editMode"></select-formula>
    <prod-form v-else-if="editMode"></prod-form>
  </div>
</template>
<script>
import { notification as showNotify } from "ant-design-vue";

import { defineComponent, watch, onMounted } from "vue";

import { useState, useMutations } from "@/store/hooks";
import List from "./components/List";
import SelectFormula from "./components/SelectFormula";
import Form from "./components/Form";
export default defineComponent({
  name: "Production",
  components: {
    "prod-list": List,
    SelectFormula,
    "prod-form": Form,
  },
  setup() {
    const { notification, editMode, newMode } = useState(
      ["notification", "editMode", "newMode"],
      "production"
    );

    const { setFormMode } = useMutations(["setFormMode"], "production");
    watch(notification, (notify) => {
      showNotify[notify.type]({
        message: notify.message,
        description: notify.description,
      });
    });
    onMounted(() => {
      setFormMode({ editMode: false, newMode: false, model: null });
    });
    return {
      editMode,
      newMode,
    };
  },
});
</script>
