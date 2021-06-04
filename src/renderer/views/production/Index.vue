<template>
  <prod-list v-if="!editMode && !newMode"></prod-list>
  <select-formula v-else-if="newMode && !editMode"></select-formula>
  <prod-form v-else-if="editMode"></prod-form>
</template>
<script>
import { notification as showNotify } from "ant-design-vue";

import { defineComponent, watch } from "vue";

import { useState } from "@/store/hooks";
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

    watch(notification, (notify) => {
      showNotify[notify.type]({
        message: notify.message,
        description: notify.description,
      });
    });

    return {
      editMode,
      newMode,
    };
  },
});
</script>
