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
      :data-source="state.list"
      :rowKey="(r) => r.id"
      style="height: 100%; font-size: 0.9em"
      :bordered="true"
      size="small"
      :pagination="false"
      id="table-data"
    >
      <template #targetTotal="{ record }">
        {{ round(record.targetTotal, 3) }}
      </template>
      <template #consumptionTotal="{ record }">
        {{ round(record.consumptionTotal, 3) }}
      </template>
      <template #diffAmount="{ record }">
        {{ round(record.diff, 3) }}
      </template>
      <template #diffPercent="{ record }">
        {{ round(record.diffPercent, 2) }} %
      </template>
    </a-table>
  </div>
</template>
<script>
import locale from "ant-design-vue/es/date-picker/locale/tr_TR";
import _, { round } from "lodash";
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
  name: "BasicProduction",
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
        title: "Formül No",
        dataIndex: "formulaNo",
        key: "formulaNo",
        width: 120,
      },
      {
        title: "Formül Adı",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
      },
      {
        title: "Parti Sayısı",
        dataIndex: "batchCount",
        key: "batchCount",
        width: 100,
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
      {
        title: "Fark",
        dataIndex: "diff",
        key: "diff",
        width: 100,
        slots: {
          customRender: "diffAmount",
        },
      },
      {
        title: "Fark Yüzdesi",
        dataIndex: "diffPercent",
        key: "diffPercent",
        width: 100,
        slots: {
          customRender: "diffPercent",
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
    const { groupedProductionList } = useActions(
      ["groupedProductionList"],
      "reports"
    );

    const state = reactive({
      list: [],
    });

    const getList = async () => {
      const result = await groupedProductionList({
        beginDate: criteria.value.beginDate,
        endDate: criteria.value.endDate,
        getDetail: false,
      });
      state.list = result.list;
    };

    const filters = inject("filters");

    const exportExcel = () => {
      const tHeader = columns.map((x) => x.title);
      const filterVal = columns.map((x) => x.dataIndex);
      const data = formatJson(filterVal, state.list);
      const footer = [
        "TOPLAM:",
        "",
        _(state.list).sumBy((x) => x.batchCount),
        round(
          _(state.list).sumBy((x) => x.targetTotal),
          3
        ),
        round(
          _(state.list).sumBy((x) => x.consumptionTotal),
          3
        ),
        round(
          _(state.list).sumBy((x) => x.consumptionTotal) -
            _(state.list).sumBy((x) => x.targetTotal)
        ),
        round(
          ((_(state.list).sumBy((x) => x.consumptionTotal) -
            _(state.list).sumBy((x) => x.targetTotal)) /
            _(state.list).sumBy((x) => x.targetTotal)) *
            100,
          2
        ),
      ];

      excel().then((excel) => {
        excel.export_json_to_excel({
          merges: ["A1:G1", "A2:B2", "C2:G2"],
          multiHeader: [
            ["TEMEL ÜRETİM RAPORU", "", "", "", "", "", ""],
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
            ],
          ],
          header: tHeader, //Header Required
          data: data.concat([footer]), //Specific data Required
          filename: "basic-production-list", //Optional
          autoWidth: true, //Optional
          bookType: "xlsx", //Optional
        });
      });
    };

    const formatJson = (filterVal, jsonData) => {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          switch (j) {
            case "targetTotal":
            case "consumptionTotal":
            case "diff":
              return round(v[j], 3);
            case "diffPercent":
              return round(v[j], 2);

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
      eval,
    };
  },
});
</script>
