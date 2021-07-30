<template>
  <div>
    <div style="margin-bottom: 3px; padding: 5px" v-if="criteria">
      <label>Üretim Tarihi: </label>
      <a-date-picker
        v-model:value="criteria.beginDate"
        :disabled-date="disabledBeginDate"
        :locale="locale"
        show-time
        valueFormat="YYYY-MM-DD HH:mm"
        :format="$filters.formatDateTime"
        placeholder="Başlangıç Tarihi"
        @openChange="handleBeginOpenChange"
      />
      <a-date-picker
        v-model:value="criteria.endDate"
        :disabled-date="disabledEndDate"
        :locale="locale"
        show-time
        valueFormat="YYYY-MM-DD HH:mm"
        :format="$filters.formatDateTime"
        placeholder="Bitiş Tarihi"
        :open="endOpen"
        @openChange="handleEndOpenChange"
      />
      <a-button @click="getList">Listele</a-button>
      <span style="margin-left: 5px">
        <a-tooltip title="Excel İndir">
          <a-button type="primary" @click="exportExcel">
            <template #icon>
              <FileExcelOutlined />
            </template>
          </a-button>
        </a-tooltip>
      </span>
    </div>

    <a-table
      :columns="columns"
      :data-source="state.result"
      :rowKey="(r) => r.id"
      style="height: 100%; font-size: 0.9em"
      :bordered="true"
      size="small"
      :pagination="false"
      :scroll="{ y: 'calc(100vh - 200px)' }"
      id="table-data"
    >
      <template #detailClickRender="{ record }">
        <strong>
          <router-link
            :to="{
              name: 'production-process',
              params: {
                id: record.productionId,
                batchNumber: record.batchNumber,
              },
            }"
            >{{ record.productionId }}</router-link
          >
        </strong>
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
        {{ round(record.targetTotal, 3) }}
      </template>
      <template #consumptionTotal="{ record }">
        {{ round(record.consumptionTotal, 3) }}
      </template>
    </a-table>
  </div>
</template>
<script>
import locale from "ant-design-vue/es/date-picker/locale/tr_TR";
import { round } from "lodash";
import { defineComponent, inject, reactive, ref } from "vue";
const excel = () => import("@/components/Export2Excel");
import {
  Table,
  Button,
  Input,
  Popconfirm,
  Tooltip,
  DatePicker,
} from "ant-design-vue";
import { FileExcelOutlined } from "@ant-design/icons-vue";
import { useState, useActions } from "@/store/hooks";
export default defineComponent({
  name: "FlatProduction",
  components: {
    "a-table": Table,
    "a-button": Button,
    "a-input": Input,
    "a-popconfirm": Popconfirm,
    "a-tooltip": Tooltip,
    "a-date-picker": DatePicker,
    FileExcelOutlined,
  },
  setup() {
    const columns = [
      {
        title: "ID",
        dataIndex: "productionId",
        key: "productionId",
        width: 60,
        slots: {
          customRender: "detailClickRender",
        },
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
      },

      {
        title: "SAP Kodu",
        dataIndex: "sapCode",
        key: "sapCode",
        width: 120,
      },
      {
        title: "Formül Adı",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
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
        width: 120,
        slots: {
          customRender: "startedAt",
        },
      },
      {
        title: "Bitiş Zamanı",
        dataIndex: "finishedAt",
        key: "finishedAt",
        width: 120,
        slots: {
          customRender: "finishedAt",
        },
      },
      {
        title: "Geçen Süre(sn)",
        dataIndex: "passedTime",
        key: "passedTime",
        width: 70,
      },
      {
        title: "Toplam Parti",
        dataIndex: "batchCount",
        key: "batchCount",
        width: 100,
        slots: {
          customRender: "batchInfo",
        },
      },
      {
        title: "Parti",
        dataIndex: "batchNumber",
        key: "batchNumber",
        width: 60,
      },
      {
        title: "Genel Parti",
        dataIndex: "general_batchNumber",
        key: "general_batchNumber",
        width: 60,
      },
      {
        title: "Hedef Miktar",
        dataIndex: "targetTotal",
        key: "targetTotal",
        width: 100,
        slots: {
          customRender: "targetTotal",
        },
      },
      {
        title: "Üretilen Miktar",
        dataIndex: "consumptionTotal",
        key: "consumptionTotal",
        width: 100,
        slots: {
          customRender: "consumptionTotal",
        },
      },
    ];
    const endOpen = ref(false);
    const disabledBeginDate = (beginDate) => {
      if (!beginDate || !criteria.value.endDate) {
        return false;
      }

      return beginDate.valueOf() > criteria.value.endDate.valueOf();
    };

    const disabledEndDate = (endDate) => {
      if (!endDate || !criteria.value.beginDate) {
        return false;
      }

      return criteria.value.beginDate.valueOf() >= endDate.valueOf();
    };

    const handleBeginOpenChange = (open) => {
      if (!open) {
        endOpen.value = true;
      }
    };

    const handleEndOpenChange = (open) => {
      endOpen.value = open;
    };

    const { criteria } = useState(["criteria"], "reports");
    const { flatProductionList } = useActions(
      ["flatProductionList"],
      "reports"
    );

    const state = reactive({
      result: [],
    });

    const getList = async () => {
      state.result = await flatProductionList({
        beginDate: criteria.value.beginDate,
        endDate: criteria.value.endDate,
      });
    };

    const exportExcel = () => {
      const tHeader = columns.map((x) => x.title);
      const filterVal = columns.map((x) => x.dataIndex);

      excel().then((excel) => {
        excel.export_json_to_excel({
          merges: ["A1:N1", "A2:B2", "C2:N2"],
          multiHeader: [
            [
              "ÜRETİM RAPORU",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
            [
              "Başlama - Bitiş Zamanı :",
              "",
              filters.formatDateTime(criteria.value.beginDate) +
                " - " +
                filters.formatDateTime(criteria.value.endDate),
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
          ],
          header: tHeader, //Header Required
          data: formatJson(filterVal, state.result), //Specific data Required
          filename: "flat-production-list", //Optional
          autoWidth: true, //Optional
          bookType: "xlsx", //Optional
        });
      });
    };

    const filters = inject("filters");
    const formatJson = (filterVal, jsonData) => {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          switch (j) {
            case "productionDate":
              return filters.formatDate(v[j]);
            case "startedAt":
            case "finishedAt":
              return filters.formatDateTime2(v[j]);
            default:
              return v[j];
          }
        })
      );
    };

    return {
      round,
      locale,
      columns,
      state,
      criteria,
      getList,
      handleBeginOpenChange,
      handleEndOpenChange,
      endOpen,
      disabledEndDate,
      disabledBeginDate,
      exportExcel,
    };
  },
});
</script>
