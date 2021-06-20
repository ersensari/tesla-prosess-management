<template>
  <div style="height: 100%" v-if="prodOrder !== null">
    <a-card>
      <template #title>
        <div class="header-flex">
          <div>
            <label>Partiye göre filtrele:</label>
            <a-select v-model:value="batchNoFilter.value" style="width: 120px">
              <a-select-option :value="0">Tümü</a-select-option>
              <a-select-option
                v-for="batch in ld(prodOrder.Groups)
                  .groupBy((x) => x.batchNumber)
                  .map((value, key) => ({
                    batchNumber: parseInt(key),
                    groups: value,
                  }))"
                :value="batch.batchNumber"
                :key="batch.batchNumber"
                >{{ batch.batchNumber }}</a-select-option
              >
            </a-select>
          </div>
          <div>
            <a-button type="danger" key="close" @click="onCloseClick"
              >Kapat</a-button
            >
          </div>
        </div>
      </template>

      <a-row>
        <a-col span="24">
          <!-- Formül Genel Bilgiler -->
          <table class="formula-general-information">
            <tr>
              <th style="width: 100px; text-align: right">Formül Adı:</th>
              <td colspan="7">{{ prodOrder.name }}</td>
            </tr>
            <tr>
              <th style="width: 100px; text-align: right">Formül No:</th>
              <td>{{ prodOrder.formulaNo }}</td>
              <th style="width: 100px; text-align: right">Tarih:</th>
              <td style="width: 200px; text-align: left">
                {{ $filters.formatDate(prodOrder.formulaDate) }}
              </td>
              <th style="width: 100px; text-align: right">Kısa Adı:</th>
              <td>{{ prodOrder.shortName }}</td>
              <th style="width: 100px; text-align: right">Üretim Tarihi:</th>
              <td>{{ $filters.formatDate(prodOrder.productionDate) }}</td>
            </tr>
            <tr>
              <th style="width: 100px; text-align: right">Versiyon:</th>
              <td>{{ prodOrder.version }}</td>
              <th style="width: 100px; text-align: right">SAP Kodu:</th>
              <td style="width: 200px; text-align: left">
                {{ prodOrder.sapCode }}
              </td>
              <th style="width: 100px; text-align: right">Açıklama:</th>
              <td>{{ prodOrder.explanation }}</td>
              <th style="width: 100px; text-align: right">Parti Sayısı:</th>
              <td>{{ prodOrder.batchCount }}</td>
            </tr>
          </table>
        </a-col>
      </a-row>

      <!-- Dozaj Grupları -->
      <a-row
        :gutter="[4, 4]"
        v-if="prodOrder !== null && prodOrder.Groups.length > 0"
      >
        <a-col
          :span="24"
          v-for="batch in filteredGroups"
          :key="batch.batchNumber"
        >
          <a-card :bordered="true" size="small" style="width: 100%">
            <a-card-meta>
              <template #title>
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgb(238, 238, 238);
                    margin-bottom: 3px;
                  "
                >
                  <div style="width: 60%">
                    <h3 style="color: rgb(224, 68, 47)">
                      Parti : {{ batch.batchNumber }}
                    </h3>
                  </div>
                  <div>
                    <div>
                      <h5>Hedef Miktar : {{ getTargetGrand() }}</h5>
                    </div>
                    <div>
                      <h5>
                        Gerçekleşen Miktar : {{ getConsumptionGrand(batch) }}
                      </h5>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h5>Fark Miktar : {{ getDiffGrand(batch) }}</h5>
                    </div>
                    <div>
                      <h5>Fark Yüzde : {{ getDiffPercentGrand(batch) }}</h5>
                    </div>
                  </div>
                </div>
              </template>
            </a-card-meta>
            <table
              style="width: 100%"
              v-for="group in ld(batch.groups).orderBy(
                (x) => x.DosingGroup.row
              )"
              :key="group.id"
            >
              <thead>
                <tr>
                  <th>Dozaj Grup</th>
                  <th style="width: 60px; text-align: center">Başladı</th>
                  <th style="width: 140px">Başlama Zamanı</th>
                  <th style="width: 60px; text-align: center">Bitti</th>
                  <th style="width: 140px">Bitiş Zamanı</th>
                  <th style="width: 100px">Hedef Miktar</th>
                  <th style="width: 100px">Gerçek Miktar</th>
                  <th style="width: 100px">Fark</th>
                  <th style="width: 100px">Fark (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ group.DosingGroup.name }}</td>
                  <td style="text-align: center">
                    <CheckCircleTwoTone
                      v-if="group.started"
                      twoToneColor="#52c41a"
                    />
                    <MinusCircleTwoTone v-else twoToneColor="#eb2f96" />
                  </td>
                  <td>{{ $filters.formatDateTime(group.startedAt) }}</td>
                  <td style="text-align: center">
                    <CheckCircleTwoTone
                      v-if="group.finished"
                      twoToneColor="#52c41a"
                    />
                    <MinusCircleTwoTone v-else twoToneColor="#eb2f96" />
                  </td>
                  <td>{{ $filters.formatDateTime(group.finishedAt) }}</td>
                  <td>{{ getTargetTotal(group.groupId) }}</td>
                  <td>
                    {{ getConsumptionTotal(group) }}
                  </td>
                  <td>{{ getDiffTotal(group) }}</td>
                  <td>{{ getDiffPercentTotal(group) }}</td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td colspan="8" style="padding-bottom: 10px">
                    <process-detail
                      :details="group.Details"
                      :hasDosingError="hasDosingError"
                    />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colspan="9"
                    style="border-bottom: 1px solid rgb(238, 238, 238)"
                  ></td>
                </tr>
              </tfoot>
            </table>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import _ from "lodash";
import { Button, Col, Row, Card, Icon, Select } from "ant-design-vue";
import { CheckCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons-vue";
import { useState, useActions } from "@/store/hooks";
import {
  defineComponent,
  onMounted,
  computed,
  reactive,
} from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import ProcessDetail from "./ProcessDetail.vue";
export default defineComponent({
  name: "ProductionProcess",
  components: {
    "a-button": Button,
    "a-row": Row,
    "a-col": Col,
    "a-card": Card,
    "a-card-meta": Card.Meta,
    "a-icon": Icon,
    "a-select": Select,
    "a-select-option": Select.Option,
    ProcessDetail,
    CheckCircleTwoTone,
    MinusCircleTwoTone,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const { findByPk } = useActions(["findByPk"], "production");
    const { model } = useState(["model"], "production");
    const batchNoFilter = reactive({ value: 0 });

    //const onCloseClick = () => router.push({ name: "production" });
    const onCloseClick = () => router.back();

    const getTargetTotal = (groupId) =>
      _.round(
        _(model.value.Details)
          .filter((x) => x.groupId === groupId)
          .sumBy((x) => x.amount),
        3
      );

    const getConsumptionTotal = (group) =>
      _.round(
        _(group.Details).sumBy((x) => x.consumptionAmount),
        3
      );

    const getDiffTotal = (group) => {
      const tTotal = getTargetTotal(group.groupId);
      const cTotal = getConsumptionTotal(group);
      return _.round((cTotal ? cTotal : 0) - tTotal, 3);
    };

    const getDiffPercentTotal = (group) => {
      const tTotal = getTargetTotal(group.groupId);
      const cTotal = getConsumptionTotal(group);
      const diff = (cTotal ? cTotal : 0) - tTotal;
      return _.round((diff / tTotal) * 100, 3);
    };

    const getTargetGrand = () =>
      _.round(
        _(model.value.Details).sumBy((x) => x.amount),
        3
      );

    const getConsumptionGrand = (batch) =>
      _.round(
        _(batch.groups.flatMap((x) => x.Details)).sumBy(
          (x) => x.consumptionAmount,
          3
        )
      );

    const getDiffGrand = (batch) => {
      const tTotal = getTargetGrand();
      const cTotal = getConsumptionGrand(batch);
      return _.round((cTotal ? cTotal : 0) - tTotal, 3);
    };

    const getDiffPercentGrand = (batch) => {
      const tTotal = getTargetGrand();
      const cTotal = getConsumptionGrand(batch);
      const diff = (cTotal ? cTotal : 0) - tTotal;
      return _.round((diff / tTotal) * 100, 3);
    };

    const hasDosingError = (detail) => {
      if (!detail.siloId) {
        return 0;
      }

      const formula = model.value.Details.find(
        (x) => x.siloId === detail.siloId
      );
      const diff = detail.consumptionAmount - formula.amount;
      return Math.abs(diff) > 0 && Math.abs(diff) > formula.tolerance;
    };

    const filteredGroups = computed(() => {
      const groups = _(model.value.Groups)
        .groupBy((x) => x.batchNumber)
        .map((value, key) => ({ batchNumber: parseInt(key), groups: value }));

      if (batchNoFilter.value !== 0) {
        return groups.filter((x) => x.batchNumber === batchNoFilter.value);
      } else return groups;
    });

    onMounted(() => {
      if (!route.params.id) {
        router.push({ name: "production" });
      }
      if (route.params.batchNumber) {
        batchNoFilter.value = parseInt(route.params.batchNumber);
      }

      findByPk(route.params.id);
    });

    return {
      ld: _,
      prodOrder: model,
      filteredGroups,
      onCloseClick,
      getTargetTotal,
      getConsumptionTotal,
      getDiffTotal,
      getDiffPercentTotal,
      getTargetGrand,
      getConsumptionGrand,
      getDiffGrand,
      getDiffPercentGrand,
      hasDosingError,
      batchNoFilter,
    };
  },
});
</script>

<style lang="scss" scoped>
.formula-general-information {
  border: 1px solid rgb(240, 240, 240);
  width: 100%;
  margin-bottom: 3px;
  td {
    padding: 2px;
  }
}
.header-flex {
  width: 100%;
  padding: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
label {
  margin-right: 5px;
}
</style>
