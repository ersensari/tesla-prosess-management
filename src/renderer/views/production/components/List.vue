<template>
  <div>
    <div style="margin-bottom: 3px; padding: 5px" v-if="filterDate">
      <label>Üretim Tarihi: </label>
      <a-date-picker
        v-model:value="filterDate.productionDate"
        type="date"
        placeholder="Tarih Seçiniz"
        :locale="locale"
        :format="$filters.formatDate"
        valueFormat="YYYY-MM-DD"
        :width="250"
        @change="handleDateFilter"
      />
    </div>

    <a-table
      :columns="columns"
      :data-source="prodOrders"
      :pagination="{ pageSize: 20 }"
      :scroll="{ y: 'calc(100vh - 225px)' }"
      :rowKey="(r) => r.id"
      style="height: 100%; font-size: 0.9em"
      :bordered="true"
      size="small"
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
      </template>
      <template #operations="{ record }">
        <div style="display: flex; gap: 0.5rem">
          <a-tooltip placement="topLeft">
            <template #title>
              <span v-if="record.selected">Üretim emri SCADA'ya bağlandı.</span>
              <span v-else-if="productionHasStarted(record)"
                >Üretim devam ediyor.</span
              >
              <span v-else-if="productionHasFinished(record)"
                >Üretim tamamlandı.</span
              >
              <span v-else>Üretim başlatmak için SCADA'ya bağlayın!</span>
            </template>

            <a-button
              shape="circle"
              size="small"
              title="Bağla"
              :style="{
                backgroundColor: record.selected ? 'lime' : '',
                color: 'black',
              }"
              :disabled="
                productionHasStarted(record) ||
                productionHasFinished(record) ||
                record.selected
              "
              @click="onSelectOrder(record.id)"
            >
              <template #icon>
                <SyncOutlined
                  spin
                  v-if="
                    productionHasStarted(record) &&
                    !productionHasFinished(record)
                  "
                  style="color: green"
                />
                <LinkOutlined v-else-if="record.selected" />
                <SafetyCertificateTwoTone
                  v-else-if="productionHasFinished(record)"
                />
                <ApiOutlined v-else />
              </template>
            </a-button>
          </a-tooltip>
          <a-tooltip placement="topLeft">
            <template #title>
              <span>Üretim Süreç Takibi</span>
            </template>

            <a-button
              shape="circle"
              size="small"
              title="Üretim Süreç Takibi"
              :disabled="
                !productionHasStarted(record) && !productionHasFinished(record)
              "
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
              :disabled="
                productionHasStarted(record) || productionHasFinished(record)
              "
              @click="onEditClick(record)"
            >
              <template #icon><EditOutlined /></template>
            </a-button>
          </a-tooltip>
          <a-popconfirm
            title="Silmek istediğinizden emin misiniz?"
            @confirm="onDeleteClick(record.id)"
            :disabled="
              productionHasStarted(record) || productionHasFinished(record)
            "
          >
            <a-tooltip placement="topLeft">
              <template #title>
                <span>Sil</span>
              </template>

              <a-button
                type="danger"
                shape="circle"
                size="small"
                :disabled="
                  productionHasStarted(record) || productionHasFinished(record)
                "
              >
                <template #icon><DeleteOutlined /></template>
              </a-button>
            </a-tooltip>
          </a-popconfirm>
        </div>
      </template>
      <template #productionDate="{ record }">
        {{ $filters.formatDate(record.productionDate) }}
      </template>
      <template #startedAt="{ record }">
        {{ $filters.formatDateTime2(record.startedAt) }}
      </template>
      <template #finishedAt="{ record }">
        {{ $filters.formatDateTime2(record.finishedAt) }}
      </template>
      <template #targetTotal="{ record }">
        {{ getTargetTotal(record) }}
      </template>
      <template #consumptionTotal="{ record }">
        {{ getConsumptionTotal(record) }}
      </template>
      <template #batchInfo="{ record }">
        {{ getActiveBatch(record) }} / {{ record.batchCount }}
      </template>
    </a-table>
  </div>
</template>

<script>
import locale from "ant-design-vue/es/date-picker/locale/tr_TR";
import _ from "lodash";
import { useRouter } from "vue-router";
import { defineComponent, onMounted, ref, reactive, watch } from "vue";
import {
  Table,
  Button,
  Input,
  Popconfirm,
  Tooltip,
  DatePicker,
} from "ant-design-vue";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  ClusterOutlined,
  LinkOutlined,
  ApiOutlined,
  SyncOutlined,
  SafetyCertificateTwoTone,
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
    "a-date-picker": DatePicker,
    SearchOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
    ClusterOutlined,
    LinkOutlined,
    ApiOutlined,
    SyncOutlined,
    SafetyCertificateTwoTone,
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
        width: 135,
        key: "operations",
        slots: { customRender: "operations", title: "newButton" },
        align: "center",
      },
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 90,
        ...filterMethods("id"),
      },
      {
        title: "Ver.",
        dataIndex: "version",
        key: "version",
        width: 40,
        align: "center",
      },
      {
        title: "Formül No",
        dataIndex: "formulaNo",
        key: "formulaNo",
        width: 120,
        ...filterMethods("formulaNo"),
      },

      {
        title: "SAP Kodu",
        dataIndex: "sapCode",
        key: "sapCode",
        width: 120,
        ...filterMethods("sapCode"),
      },
      {
        title: "Formül Adı",
        dataIndex: "name",
        key: "name",
        ellipsis: true,

        ...filterMethods("name"),
      },
      {
        title: "Üretim Tarihi",
        dataIndex: "productionDate",
        key: "productionDate",
        width: 100,
        slots: {
          customRender: "productionDate",
        },
      },
      {
        title: "Başlama Zamanı",
        dataIndex: "startedAt",
        key: "startedAt",
        width: 140,
        slots: {
          customRender: "startedAt",
        },
      },
      {
        title: "Bitiş Zamanı",
        dataIndex: "finishedAt",
        key: "finishedAt",
        width: 140,
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
      _.round(
        _(prod.Details)
          .filter((x) => x.dosingOrder >= 0)
          .sumBy((x) => x.amount) * prod.batchCount,
        3
      );

    const getConsumptionTotal = (prod) =>
      _.round(
        _(prod.Groups)
          .filter((x) => x.started && x.finished)
          .flatMap((x) => x.Details)
          .sumBy((x) => x.consumptionAmount),
        3
      );

    const getActiveBatch = (prod) => {
      if (prod.Groups && prod.Groups.length > 0) {
        const activeBatch = _(prod.Groups)
          .sortBy((x) => x.batchNumber)
          .findLast((x) => x.started);
        return activeBatch ? activeBatch.batchNumber : 0;
      } else return 0;
    };

    const router = useRouter();
    const { prodOrders, filterDate } = useState(
      ["prodOrders", "filterDate"],
      "production"
    );
    const { findAll, remove, selectOrder } = useActions(
      ["findAll", "save", "update", "remove", "selectOrder"],
      "production"
    );

    const { setFormMode } = useMutations(["setFormMode"], "production");

    const productionHasStarted = (prod) => prod.startedAt && !prod.finishedAt;
    const productionHasFinished = (prod) => prod.finishedAt;

    const onOpenDetailClick = (id) => {
      router.push({ name: "production-process", params: { id } });
    };

    const onSelectOrder = (id) => {
      selectOrder(id);
    };

    onMounted(() => {
      findAll({
        beginDate: filterDate.value.productionDate,
        endDate: filterDate.value.productionDate,
      });
      setFormMode({ editMode: false, newMode: false, model: null });
    });

    const handleDateFilter = (date) => {
      findAll({
        beginDate: filterDate.value.productionDate,
        endDate: filterDate.value.productionDate,
      });
    };

    return {
      filterDate,
      locale,
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
      onSelectOrder,
      getTargetTotal,
      prodOrders,
      getActiveBatch,
      productionHasStarted,
      productionHasFinished,
      getConsumptionTotal,
      handleDateFilter,
    };
  },
});
</script>
