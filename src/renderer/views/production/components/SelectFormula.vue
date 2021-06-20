<template>
  <div style="height: 100%">
    <a-row type="flex" align="middle">
      <a-col flex="70px">
        <a-button type="danger" @click="cancelFormulaSelection">İptal</a-button>
      </a-col>
      <a-col flex="auto">
        <a-alert
          message="Üretim emri oluşturmak istediğiniz Formül'ü seçiniz."
          type="info"
          show-icon
        />
      </a-col>
    </a-row>

    <a-table
      :columns="columns"
      :data-source="formulas"
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

      <template #operations="{ record }">
        <div style="display: flex; gap: 0.5rem">
          <a-tooltip placement="topLeft">
            <template #title>
              <span>Seç</span>
            </template>

            <a-button
              type="primary"
              shape="circle"
              size="small"
              title="Seç"
              @click="onSelectClick(record)"
            >
              <template #icon><CheckCircleOutlined /></template>
            </a-button>
          </a-tooltip>
        </div>
      </template>
      <template #formulaDate="{ record }">
        {{ $filters.formatDate(record.formulaDate) }}
      </template>
      <template #totalAmount="{ record }">
        {{ getFormulaTotalAmount(record) }}
      </template>
    </a-table>
  </div>
</template>

<script>
import _ from "lodash";
import {
  Table,
  Button,
  Tooltip,
  Icon,
  Input,
  Alert,
  Row,
  Col,
} from "ant-design-vue";
import {
  CheckCircleOutlined,
  SearchOutlined,
  AlertOutlined,
} from "@ant-design/icons-vue";
import { useState, useActions, useMutations } from "@/store/hooks";
import { defineComponent, ref, onMounted, toRaw } from "vue";
export default defineComponent({
  name: "SelectFormula",
  components: {
    "a-table": Table,
    "a-button": Button,
    "a-tooltip": Tooltip,
    "a-icon": Icon,
    "a-input": Input,
    "a-alert": Alert,
    "a-row": Row,
    "a-col": Col,
    CheckCircleOutlined,
    SearchOutlined,
    AlertOutlined,
  },
  setup() {
    const searchText = ref("");
    const searchedColumn = ref("");
    const searchInput = ref();
    const { formulas } = useState(["formulas"], "formula");
    const { findAll } = useActions(["findAll"], "formula");
    const { setFormMode } = useMutations(["setFormMode"], "production");

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
        width: 55,
        key: "operations",
        slots: { customRender: "operations" },
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
        width: 100,
        ...filterMethods("version"),
      },
      {
        title: "SAP Kodu",
        dataIndex: "sapCode",
        key: "sapCode",
        width: 150,
        ...filterMethods("sapCode"),
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
        title: "Tarih",
        dataIndex: "formulaDate",
        key: "formulaDate",
        width: 120,
        slots: {
          customRender: "formulaDate",
        },
      },
      {
        title: "Açıklama",
        dataIndex: "explanation",
        key: "explanation",
        ellipsis: true,
        ...filterMethods("explanation"),
      },
      {
        title: "Toplam",
        dataIndex: "total",
        key: "total",
        width: 100,
        slots: {
          customRender: "totalAmount",
        },
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

    const getFormulaTotalAmount = (formula) =>
      _(formula.Details)
        .filter((x) => x.dosingOrder >= 0)
        .sumBy((x) => x.amount);

    const onSelectClick = (formula) => {
      formula.Details = formula.Details.filter(
        (x) => x.dosingOrder > 0 && x.amount > 0
      );
      formula.id = undefined;
      formula.Details.map((x) => (x.id = undefined));
      setFormMode({ editMode: true, newMode: true, model: formula });
    };

    const cancelFormulaSelection = () => {
      setFormMode({ editMode: false, newMode: false, model: null });
    };

    onMounted(() => {
      findAll();
    });

    return {
      formulas,
      columns,
      handleSearch,
      handleReset,
      searchText,
      searchInput,
      searchedColumn,
      getFormulaTotalAmount,
      onSelectClick,
      cancelFormulaSelection,
    };
  },
});
</script>
