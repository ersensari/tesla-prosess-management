<template>
  <a-modal
    v-model:visible="visible"
    title="Malzeme Seç"
    :maskClosable="false"
    width="1000px"
    @cancel="onModalCancelClick"
  >
    <div style="height: 500px">
      <a-table
        :columns="rawMaterialsColumns"
        :data-source="rawMaterials"
        :pagination="{ pageSize: 10 }"
        :scroll="{ y: 450 }"
        :rowKey="(r) => r.id"
        style="height: 100%"
        class="ant-table-striped"
        size="small"
        :row-selection="rowSelection"
        :rowClassName="
          (record, index) => (index % 2 === 1 ? 'table-striped' : null)
        "
        :bordered="true"
      >
        <template
          #filterDropdown="{
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            column,
          }"
        >
          <div style="padding: 8px">
            <a-input
              ref="searchInput"
              :placeholder="`Bul: ${column.title}`"
              :value="selectedKeys[0]"
              style="width: 188px; margin-bottom: 8px; display: block"
              @change="
                (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
              "
              @pressEnter="
                handleSearch(selectedKeys, confirm, column.dataIndex)
              "
            />
            <a-button
              type="primary"
              size="small"
              style="width: 90px; margin-right: 8px"
              @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
            >
              <template #icon><SearchOutlined /></template>
              Bul
            </a-button>
            <a-button
              size="small"
              style="width: 90px"
              @click="handleReset(clearFilters)"
            >
              Temizle
            </a-button>
          </div>
        </template>
        <template #filterIcon="filtered">
          <SearchOutlined
            :style="{ color: filtered ? '#108ee9' : undefined }"
          />
        </template>
        <template #customRender="{ text, column }">
          <span v-if="searchText && searchedColumn === column.dataIndex">
            <template
              v-for="(fragment, i) in text
                .toString()
                .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
            >
              <mark
                v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                class="highlight"
                :key="i"
              >
                {{ fragment }}
              </mark>
              <template v-else>{{ fragment }}</template>
            </template>
          </span>
          <template v-else>
            {{ text }}
          </template>
        </template>
      </a-table>
    </div>
    <template #footer>
      <div style="display: flex; justify-content: space-between">
        <a-button key="back" @click="onModalCancelClick" :disabled="loading"
          >İptal</a-button
        >
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="onRawMaterialSelectClick"
          >Tamam</a-button
        >
      </div>
    </template>
  </a-modal>
</template>

<script>
import {
  Row,
  Col,
  Table,
  Button,
  Tooltip,
  Modal,
  Input,
  notification as showNotify,
} from "ant-design-vue";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { useState, useActions } from "@/store/hooks";
import { defineComponent, onMounted, ref, watch } from "vue";

export default defineComponent({
  name: "Formulas",
  components: {
    "a-row": Row,
    "a-col": Col,
    "a-table": Table,
    "a-tooltip": Tooltip,
    "a-button": Button,
    "a-modal": Modal,
    "a-input": Input,
    FilterOutlined,
    SearchOutlined,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  emits: ["onRawMaterialSelect", "onRawMaterialCancel"],
  setup(_, { emit }) {
    const selectedRawMaterial = ref(null);

    const searchText = ref("");
    const searchedColumn = ref("");
    const searchInput = ref();

    const filterMethods = (columnName) => {
      return {
        slots: {
          filterDropdown: "filterDropdown",
          filterIcon: "filterIcon",
          customRender: "customRender",
        },
        sorter: (a, b) => a[columnName].length - b[columnName].length,
        sortDirections: ["descend", "ascend"],
        onFilter: (value, record) =>
          record[columnName]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus();
            }, 0);
          }
        },
      };
    };

    const rawMaterialsColumns = [
      {
        title: "Kodu",
        dataIndex: "rawNo",
        key: "rawNo",
        width: 120,
        ...filterMethods("rawNo"),
      },
      {
        title: "Tam Adı",
        dataIndex: "name",
        key: "name",
        width: 300,
        ...filterMethods("name"),
      },
      {
        title: "Kısa Adı",
        dataIndex: "shortName",
        key: "shortName",
        width: 150,
        ...filterMethods("shortName"),
      },
      {
        title: "SAP Kodu",
        dataIndex: "sapCode",
        key: "sapCode",
        width: 150,
        ...filterMethods("sapCode"),
      },
      {
        title: "Açıklama",
        dataIndex: "explanation",
        key: "explanation",
        ellipsis: true,
        ...filterMethods("explanation"),
      },
    ];

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      searchText.value = selectedKeys[0];
      searchedColumn.value = dataIndex;
    };

    const handleReset = (clearFilters) => {
      clearFilters();
      searchText.value = "";
    };

    const rowSelection = {
      type: "radio",
      onChange: (_, selectedRows) => {
        selectedRawMaterial.value = selectedRows[0];
      },
    };
    const onModalCancelClick = () => {
      emit("onRawMaterialCancel");
    };

    const onRawMaterialSelectClick = () => {
      emit("onRawMaterialSelect", selectedRawMaterial.value);
    };

    const { items: rawMaterials, loading, notification } = useState(
      ["items", "loading", "notification", "editMode"],
      "rawMaterial"
    );
    const { findAll } = useActions(
      ["findAll", "save", "update", "remove"],
      "rawMaterial"
    );

    watch(notification, (notify) => {
      showNotify[notify.type]({
        message: notify.message,
        description: notify.description,
      });
    });

    onMounted(findAll);

    return {
      rawMaterialsColumns,
      rawMaterials,
      filterMethods,
      searchText,
      searchedColumn,
      searchInput,
      handleSearch,
      handleReset,
      loading,
      onRawMaterialSelectClick,
      onModalCancelClick,
      rowSelection,
    };
  },
});
</script>

<style lang="scss" scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
