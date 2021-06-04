<template>
  <div style="height: 100%; overflow: hidden scroll">
    <a-row :gutter="[8, 8]" style="max-height: 100%">
      <a-col
        :xs="{ span: 24 }"
        :md="{ span: 24 }"
        :lg="{ span: 24 }"
        :xl="{ span: 24 }"
        :xxl="{ span: 12 }"
        v-for="group in items.filter((x) => x.manual === false)"
        :key="group.id"
      >
        <a-table
          :pagination="false"
          :dataSource="group.Silos"
          :columns="columns"
          :rowKey="(r) => r.id"
        >
          <template #title>
            <div class="header">{{ group.name }}</div></template
          >
          <template #operations="{ record }">
            <div style="display: flex; gap: 0.5rem">
              <a-tooltip placement="topLeft">
                <template #title>
                  <span>Malzeme ile ilişkilendir</span>
                </template>

                <a-button
                  type="primary"
                  shape="circle"
                  size="small"
                  title="Malzeme ile ilişkilendir"
                  @click="onAssignRawClick(record)"
                >
                  <template #icon><FilterOutlined /></template>
                </a-button>
              </a-tooltip>
            </div>
          </template>
        </a-table>
      </a-col>

      <a-modal
        v-model:visible="assignModalVisible"
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
                    (e) =>
                      setSelectedKeys(e.target.value ? [e.target.value] : [])
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
                    .split(
                      new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')
                    )"
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
              @click="onModalSaveClick"
              >Kaydet</a-button
            >
          </div>
        </template>
      </a-modal>
    </a-row>
  </div>
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
import { useState, useActions, useMutations } from "@/store/hooks";
import { defineComponent, onMounted, ref, toRaw, watch } from "vue";

export default defineComponent({
  name: "Silos",
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
  setup() {
    /**
     * hammadde tablosu filter
     */
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

    const rowSelection = {
      type: "radio",
      onChange: (selectedRowKeys) => {
        selectedRawMaterial.value = selectedRowKeys;
      },
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

    const {
      items,
      rawMaterials,
      loading,
      assignModalVisible,
      notification,
    } = useState(
      [
        "items",
        "rawMaterials",
        "loading",
        "assignModalVisible",
        "notification",
      ],
      "dosingGroup"
    );
    const { findAll, findAllRawMaterials, assignRaw } = useActions(
      ["findAll", "findAllRawMaterials", "assignRaw"],
      "dosingGroup"
    );

    const { setAssignModalVisible } = useMutations(
      ["setAssignModalVisible"],
      "dosingGroup"
    );

    const columns = [
      {
        width: 30,
        key: "operations",
        slots: { customRender: "operations" },
      },
      {
        title: "Sıra",
        dataIndex: "row",
        width: 80,
      },
      {
        title: "Silo",
        dataIndex: "code",
        width: 100,
      },
      {
        title: "Malzeme Adı",
        dataIndex: "RawMaterial.name",
      },
      {
        title: "Malzeme Kodu",
        dataIndex: "RawMaterial.rawNo",
        width: 120,
      },
    ];

    const selectedRawMaterial = ref(null);
    const selectedSilo = ref(null);

    const onModalCancelClick = () => {
      setAssignModalVisible(false);
    };
    const onModalSaveClick = (e) => {
      e.preventDefault();
      if (selectedRawMaterial.value && selectedSilo) {
        assignRaw({
          siloId: selectedSilo.value.id,
          rawMaterialId: toRaw(selectedRawMaterial.value)[0],
        });
        findAll();
      }
    };

    const onAssignRawClick = (silo) => {
      selectedSilo.value = silo;
      findAllRawMaterials();
      setAssignModalVisible(true);
    };

    watch(notification, (notify) => {
      showNotify[notify.type]({
        message: notify.message,
        description: notify.description,
      });
    });

    onMounted(findAll);

    return {
      items,
      columns,
      rawMaterialsColumns,
      onAssignRawClick,
      onModalCancelClick,
      onModalSaveClick,
      rawMaterials,
      filterMethods,
      searchText,
      searchedColumn,
      searchInput,
      handleSearch,
      handleReset,
      loading,
      assignModalVisible,
      rowSelection,
    };
  },
});
</script>

<style lang="scss">
.header {
  background-color: #3d3d3d;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  width: 100%;
  color: #fff;
  padding: 5px 0px;
}
</style>
