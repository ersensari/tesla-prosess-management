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
      :rowKey="(r) => r.id"
      style="height: 100%; font-size: 1em"
      :data-source="state.list"
      :pagination="false"
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
  name: "ConsumedRawMaterial",
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
        title: "Hammadde No",
        dataIndex: "rawNo",
        key: "rawNo",
        width: 140,
      },
      {
        title: "Hammadde Adı",
        dataIndex: "rawName",
        key: "rawName",
        ellipsis: true,
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
        title: "Kullanılan Miktar",
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
        getDetail: true,
      });

      const flatDetails = result.details.flatMap((x) => x.Details);

      const groupedDetails = _(flatDetails)
        .groupBy((x) => x.rawMaterialId)
        .map((value, key) => ({
          RawMaterial: value[0].RawMaterial,
          value,
        }))
        .map((x) => ({
          id: x.RawMaterial.id,
          rawNo: x.RawMaterial.rawNo,
          rawName: x.RawMaterial.name,
          targetTotal: _(x.value).sumBy((y) => y.amount),
          consumptionTotal: _(x.value).sumBy((y) => y.consumptionAmount),
        }))
        .map((x) => ({
          ...x,
          diff: x.consumptionTotal - x.targetTotal,
          diffPercent:
            ((x.consumptionTotal - x.targetTotal) / x.targetTotal) * 100,
        }));

      state.list = groupedDetails.toJSON();
    };
    const filters = inject("filters");

    const exportExcel = () => {
      const tHeader = columns.map((x) => x.title);
      const filterVal = columns.map((x) => x.dataIndex);
      const data = formatJson(filterVal, state.list);

      excel().then((excel) => {
        excel.export_json_to_excel({
          merges: ["A1:F1", "A2:B2", "C2:F2"],
          multiHeader: [
            ["TÜKETİLEN HAMMADDE RAPORU", "", "", "", "", ""],
            [
              "Başlama - Bitiş Zamanı :",
              "",
              filters.formatDateTime(criteria.value.beginDate) +
                " - " +
                filters.formatDateTime(criteria.value.endDate),
              "",
              "",
              "",
            ],
          ],
          header: tHeader, //Header Required
          data, //Specific data Required
          filename: "consumed-raw-material-report", //Optional
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
    };
  },
});
</script>
