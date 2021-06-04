<template>
  <a-table
    :columns="columns"
    :data-source="prodOrders"
    :pagination="{ pageSize: 20 }"
    :scroll="{ y: 'calc(100vh - 225px)' }"
    :rowKey="(r) => r.id"
    style="height: 100%"
    class="ant-table-striped"
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
          @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
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
      <SearchOutlined :style="{ color: filtered ? '#108ee9' : undefined }" />
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

    <template #newButton>
      <div style="margin-left: 36px">
        <a-tooltip placement="topLeft">
          <template #title>
            <span>Yeni Formül Ekle</span>
          </template>
          <a-button
            type="primary"
            shape="circle"
            size="small"
            @click="onNewClick"
          >
            <template #icon><PlusCircleOutlined /></template>
          </a-button>
        </a-tooltip>
      </div>
    </template>
    <template #operations="{ record }">
      <div style="display: flex; gap: 0.5rem">
        <a-tooltip placement="topLeft">
          <template #title>
            <span>Üretim Süreç Takibi</span>
          </template>

          <a-button
            shape="circle"
            size="small"
            title="Üretim Süreç Takibi"
            @click="onOpenDetailClick(record.id)"
          >
            <template #icon><ClusterOutlined /></template>
          </a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft">
          <template #title>
            <span>Düzenle</span>
          </template>

          <a-button
            type="primary"
            shape="circle"
            size="small"
            title="Düzenle"
            :disabled="productionHasStarted(record)"
            @click="onEditClick(record)"
          >
            <template #icon><EditOutlined /></template>
          </a-button>
        </a-tooltip>
        <a-popconfirm
          title="Silmek istediğinizden emin misiniz?"
          @confirm="onDeleteClick(record.id)"
          :disabled="productionHasStarted(record)"
        >
          <a-tooltip placement="topLeft">
            <template #title>
              <span>Sil</span>
            </template>

            <a-button
              type="danger"
              shape="circle"
              size="small"
              :disabled="productionHasStarted(record)"
            >
              <template #icon><DeleteOutlined /></template>
            </a-button>
          </a-tooltip>
        </a-popconfirm>
      </div>
    </template>
    <template #productionDate="{ record }">
      {{ formatDate(record.productionDate) }}
    </template>
    <template #startedAt="{ record }">
      {{ getStartedAt(record) }}
    </template>
    <template #finishedAt="{ record }">
      {{ getFinishedAt(record) }}
    </template>
    <template #targetTotal="{ record }">
      {{ getTargetTotal(record) }}
    </template>
    <template #batchInfo="{ record }">
      {{ getActiveBatch(record) }} / {{ record.batchCount }}
    </template>
  </a-table>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import { useRouter } from "vue-router";
import { defineComponent, onMounted, ref } from "vue";
import { Table, Button, Input, Popconfirm, Tooltip } from "ant-design-vue";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  ClusterOutlined,
} from "@ant-design/icons-vue";
import { useState, useActions, useMutations } from "@/store/hooks";
export default defineComponent({
  name: "List",
  components: {
    "a-table": Table,
    "a-button": Button,
    "a-input": Input,
    "a-popconfirm": Popconfirm,
    "a-tooltip": Tooltip,
    SearchOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
    ClusterOutlined,
  },
  setup() {
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

    const columns = [
      {
        width: 130,
        key: "operations",
        slots: { customRender: "operations", title: "newButton" },
      },
      {
        title: "Formül No",
        dataIndex: "formulaNo",
        key: "formulaNo",
        width: 140,
        ...filterMethods("formulaNo"),
      },
      {
        title: "Ver.",
        dataIndex: "version",
        key: "version",
        width: 60,
      },
      {
        title: "SAP Kodu",
        dataIndex: "sapCode",
        key: "sapCode",
        width: 140,
        ...filterMethods("sapCode"),
      },
      {
        title: "Formül Adı",
        dataIndex: "name",
        key: "name",
        ...filterMethods("name"),
      },
      {
        title: "Üretim Tarihi",
        dataIndex: "productionDate",
        key: "productionDate",
        width: 120,
        slots: {
          customRender: "productionDate",
        },
      },
      {
        title: "Başlama Zamanı",
        dataIndex: "startedAt",
        key: "startedAt",
        width: 160,
        slots: {
          customRender: "startedAt",
        },
      },
      {
        title: "Bitiş Zamanı",
        dataIndex: "finishedAt",
        key: "finishedAt",
        width: 160,
        slots: {
          customRender: "finishedAt",
        },
      },
      {
        title: "Parti Sayısı",
        dataIndex: "batchCount",
        key: "batchCount",
        width: 100,
        slots: {
          customRender: "batchInfo",
        },
      },
      {
        title: "Toplamlar",
        children: [
          {
            title: "Hedef",
            dataIndex: "targetTotal",
            key: "targetTotal",
            width: 100,
            slots: {
              customRender: "targetTotal",
            },
          },
          {
            title: "Üretilen",
            dataIndex: "consumptionTotal",
            key: "consumptionTotal",
            width: 100,
            slots: {
              customRender: "consumptionTotal",
            },
          },
        ],
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

    const onNewClick = () => {
      setFormMode({ editMode: false, newMode: true, model: null });
    };
    const onEditClick = (item) => {
      setFormMode({ editMode: true, newMode: false, model: item });
    };

    const onDeleteClick = (id) => {
      remove(id);
    };

    const getTargetTotal = (prod) =>
      _(prod.Details)
        .filter((x) => x.dosingOrder >= 0)
        .sumBy((x) => x.amount) * prod.batchCount;

    const getActiveBatch = (prod) => {
      if (prod.Groups && prod.Groups.length > 0) {
        const activeBatch = _(prod.Groups)
          .sortBy((x) => x.batchNumber)
          .findLast((x) => x.started && !x.finished);
        return activeBatch ? activeBatch.batchNumber : 0;
      } else return 0;
    };

    const router = useRouter();
    const { prodOrders } = useState(["prodOrders"], "production");
    const { findAll, remove } = useActions(
      ["findAll", "save", "update", "remove"],
      "production"
    );

    const { setFormMode } = useMutations(["setFormMode"], "production");

    const formatDate = (date) =>
      date ? moment(date).format("DD.MM.YYYY") : "";
    const formatDateTime = (date) =>
      date ? moment(date).format("DD.MM.YYYY hh:mm") : "";

    const getStartedAt = (prod) => {
      if (prod.Groups && prod.Groups.length > 0) {
        const firstBatch = _(prod.Groups).find((x) => x.batchNumber === 1);
        return formatDateTime(firstBatch.startedAt);
      } else return "";
    };
    const getFinishedAt = (prod) => {
      if (prod.Groups && prod.Groups.length > 0) {
        const lastBatch = _(prod.Groups)
          .sortBy((x) => x.batchNumber)
          .last();
        return formatDateTime(lastBatch.finishedAt);
      } else return "";
    };

    const productionHasStarted = (prod) =>
      prod.Groups && prod.Groups.length > 0;

    const onOpenDetailClick = (id) => {
      router.push({ name: "production-process", params: { id } });
    };
    onMounted(() => {
      findAll();
      setFormMode({ editMode: false, newMode: false, model: null });
    });

    return {
      moment,
      columns,
      searchText,
      searchedColumn,
      searchInput,
      handleSearch,
      handleReset,
      onNewClick,
      onEditClick,
      onDeleteClick,
      onOpenDetailClick,
      getTargetTotal,
      prodOrders,
      formatDate,
      getActiveBatch,
      getStartedAt,
      getFinishedAt,
      productionHasStarted,
    };
  },
});
</script>
