<template>
  <a-card height="100%">
    <a-row v-if="prodOrder !== null">
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
              {{ formatDate(prodOrder.formulaDate) }}
            </td>
            <th style="width: 100px; text-align: right">Kısa Adı:</th>
            <td>{{ prodOrder.shortName }}</td>
            <th style="width: 100px; text-align: right">Üretim Tarihi:</th>
            <td>{{ formatDate(prodOrder.productionDate) }}</td>
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
      type="flex"
      :gutter="[4, 4]"
      v-if="prodOrder !== null && prodOrder.Groups.length > 0"
    >
      <a-col
        :span="24"
        v-for="batch in ld(prodOrder.Groups)
          .groupBy((x) => x.batchNumber)
          .map((value, key) => ({ batchNumber: key, groups: value }))"
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
                  border-bottom: 1px solid #ccc;
                  margin-bottom: 3px;
                "
              >
                <div style="width: 60%">
                  <h3>Parti : {{ batch.batchNumber }}</h3>
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
            style="width: 100%; font-size: 0.8em"
            v-for="group in batch.groups"
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
                <td>{{ formatDateTime(group.startedAt) }}</td>
                <td style="text-align: center">
                  <CheckCircleTwoTone
                    v-if="group.finished"
                    twoToneColor="#52c41a"
                  />
                  <MinusCircleTwoTone v-else twoToneColor="#eb2f96" />
                </td>
                <td>{{ formatDateTime(group.finishedAt) }}</td>
                <td>{{ getTargetTotal(group.groupId) }}</td>
                <td>
                  {{ getConsumptionTotal(group) }}
                </td>
                <td>{{ getDiffTotal(group) }}</td>
                <td>{{ getDiffPercentTotal(group) }}</td>
              </tr>
            </tbody>
          </table>
        </a-card>
      </a-col>
    </a-row>

    <template #extra>
      <span style="padding: 3px">
        <a-button type="danger" key="close" @click="onCloseClick"
          >Kapat</a-button
        >
      </span>
    </template>
  </a-card>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import { Button, Col, Row, Card, Icon } from "ant-design-vue";
import { CheckCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons-vue";
import { useState, useActions, useMutations } from "@/store/hooks";
import { computed, defineComponent, onMounted } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "ProductionProcess",
  components: {
    "a-button": Button,
    "a-row": Row,
    "a-col": Col,
    "a-card": Card,
    "a-card-meta": Card.Meta,
    "a-icon": Icon,
    CheckCircleTwoTone,
    MinusCircleTwoTone,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const { findByPk } = useActions(["findByPk"], "production");
    const { model } = useState(["model"], "production");

    const formatDate = (date) =>
      date ? moment(date).format("DD.MM.YYYY") : "";
    const formatDateTime = (date) =>
      date ? moment(date).format("DD.MM.YYYY hh:mm") : "";
    const onCloseClick = () => router.push({ name: "production" });

    const getTargetTotal = (groupId) =>
      _(model.value.Details)
        .filter((x) => x.groupId === groupId)
        .sumBy((x) => x.amount);

    const getConsumptionTotal = (group) =>
      _(group.Details)
        .filter((x) => x.groupId === group.groupId)
        .sumBy((x) => x.consumptionAmount);

    const getDiffTotal = (group) => {
      const tTotal = getTargetTotal(group.groupId);
      const cTotal = getConsumptionTotal(group.Details);
      return (cTotal ? cTotal : 0) - tTotal;
    };

    const getDiffPercentTotal = (group) => {
      const tTotal = getTargetTotal(group.groupId);
      const cTotal = getConsumptionTotal(group);
      const diff = (cTotal ? cTotal : 0) - tTotal;
      return (diff / tTotal) * 100;
    };

    const getTargetGrand = () => _(model.value.Details).sumBy((x) => x.amount);

    const getConsumptionGrand = (batch) =>
      _(batch.groups.flatMap((x) => x.Details)).sumBy(
        (x) => x.consumptionAmount
      );

    const getDiffGrand = (batch) => {
      const tTotal = getTargetGrand();
      const cTotal = getConsumptionGrand(batch);
      return (cTotal ? cTotal : 0) - tTotal;
    };

    const getDiffPercentGrand = (batch) => {
      const tTotal = getTargetGrand();
      const cTotal = getConsumptionGrand(batch);
      const diff = (cTotal ? cTotal : 0) - tTotal;
      return (diff / tTotal) * 100;
    };

    onMounted(() => {
      if (!route.params.id) {
        router.push({ name: "production" });
      }
      findByPk(route.params.id);
    });

    return {
      ld: _,
      prodOrder: model,
      formatDate,
      formatDateTime,
      onCloseClick,
      getTargetTotal,
      getConsumptionTotal,
      getDiffTotal,
      getDiffPercentTotal,
      getTargetGrand,
      getConsumptionGrand,
      getDiffGrand,
      getDiffPercentGrand,
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
</style>
