<template>
  <div style="height: 100%">
    <a-card v-if="selectedOrder !== null">
      <a-card-meta>
        <template #title>
          <div style="background-color: #b80b0b3b; padding: 3px">
            <WarningTwoTone twoToneColor="#eb2f96" />
            Bağlanmış Üretim Emri
          </div>
        </template>
        <template #description>
          <div class="info-box">
            <div>
              <label>Formül:</label>
              {{ selectedOrder.name }}
            </div>
            <div>
              <label>Üretim Tarihi:</label>
              {{ $filters.formatDate(selectedOrder.productionDate) }}
            </div>
            <div>
              <label>Parti Sayısı:</label>
              {{ selectedOrder.batchCount }}
            </div>
          </div>
        </template>
      </a-card-meta>
    </a-card>
    <a-alert
      v-else
      message="Scada'ya bağlanmış üretim emri bulunamadı!"
      type="warning"
      show-icon
    />
    <div style="height: 30px"></div>
    <a-card v-if="model.activeOrder">
      <a-card-meta class="card-meta">
        <template #title>
          <div class="header-flex">
            <div><label>ID :</label> {{ model.activeOrder.id }}</div>
            <div>
              <label>Aktif Üretim :</label> {{ model.activeOrder.name }}
            </div>
            <div>
              <label>Parti Sayısı :</label>
              {{ model.activeOrder.batchCount }}
            </div>
            <div>
              <label>Başlama Zamanı :</label>
              {{ $filters.formatDateTime(model.activeOrder.startedAt) }}
            </div>
            <div>
              <label>Geçen Süre :</label>
              {{ timeDiff.days }} gün {{ timeDiff.hours }} sa.
              {{ timeDiff.minutes }} dk. {{ timeDiff.seconds }} sn.
            </div>
          </div>
          <div style="align-items: left; display: flex; flex-direction: column">
            <div style="font-size: 0.8em">
              Parti : {{ activeBatch }} / {{ model.activeOrder.batchCount }}
            </div>
            <a-progress
              :percent="progressBatchPercent"
              status="active"
              strokeLinecap="square"
              type="line"
            />
          </div>
        </template>
      </a-card-meta>
      <table
        style="width: 100%"
        v-for="group in ld(filteredGroups.groups).orderBy(
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
              <CheckCircleTwoTone v-if="group.started" twoToneColor="#52c41a" />
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
    <a-alert
      v-else
      message="Aktif üretim bulunmamaktadır!"
      type="warning"
      show-icon
    />
  </div>
</template>
<script>
import _ from "lodash";
import { Button, Col, Row, Card, Progress, Alert } from "ant-design-vue";

import {
  defineComponent,
  onMounted,
  computed,
  reactive,
  toRef,
  watch,
} from "vue";
import { useState, useActions, useMutations } from "@/store/hooks";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";
import {
  WarningTwoTone,
  CheckCircleTwoTone,
  MinusCircleTwoTone,
} from "@ant-design/icons-vue";
import ProcessDetail from "./production/ProcessDetail.vue";

export default defineComponent({
  name: "Home",
  components: {
    "a-button": Button,
    "a-row": Row,
    "a-col": Col,
    "a-card": Card,
    "a-card-meta": Card.Meta,
    "a-progress": Progress,
    "a-alert": Alert,
    WarningTwoTone,
    CheckCircleTwoTone,
    MinusCircleTwoTone,
    ProcessDetail,
  },
  setup() {
    const route = useRoute();
    const { selected } = useState(["selected"], "production");
    const { getActiveOrder, getSelectedOrder } = useActions(
      ["getActiveOrder", "getSelectedOrder"],
      "production"
    );
    const model = reactive({
      activeOrder: null,
    });

    const getTargetTotal = (groupId) =>
      _.round(
        _(model.activeOrder.Details)
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

    const hasDosingError = (detail) => {
      if (!detail.siloId) {
        return 0;
      }

      const formula = model.activeOrder.Details.find(
        (x) => x.siloId === detail.siloId
      );
      const diff = detail.consumptionAmount - formula.amount;
      return Math.abs(diff) > 0 && Math.abs(diff) > formula.tolerance;
    };

    const filteredGroups = computed(() => {
      const groups = _(model.activeOrder.Groups)
        .groupBy((x) => x.batchNumber)
        .map((value, key) => ({ batchNumber: parseInt(key), groups: value }));

      if (activeBatch.value !== 0) {
        return groups.find((x) => x.batchNumber === activeBatch.value);
      } else return groups.first();
    });

    const activeBatch = computed(() => {
      if (model.activeOrder.Groups && model.activeOrder.Groups.length > 0) {
        const activeBatch = _(model.activeOrder.Groups)
          .sortBy((x) => x.batchNumber)
          .findLast((x) => x.started);
        return activeBatch ? activeBatch.batchNumber : 0;
      } else return 0;
    });

    const timeDiff = reactive({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    const calcTimeDiff = () => {
      if (model.activeOrder) {
        let _MILISECONDS =
          new Date().getTime() - model.activeOrder.startedAt.getTime();
        _MILISECONDS = _MILISECONDS < 0 ? 0 : _MILISECONDS;
        timeDiff.days = Math.floor(_MILISECONDS / (24 * 60 * 60 * 1000));
        timeDiff.hours = Math.floor(
          (_MILISECONDS / (60 * 60 * 1000) - timeDiff.days * 24) % 24
        );
        timeDiff.minutes = Math.floor(
          (_MILISECONDS / (60 * 1000) - timeDiff.hours * 60) % 60
        );
        timeDiff.seconds = Math.floor(
          (_MILISECONDS / 1000 - timeDiff.minutes * 60) % 60
        );
      }
    };

    const progressBatchPercent = computed(() => {
      return (activeBatch.value / model.activeOrder.batchCount) * 100;
    });
    let started = false;
    const refresh = () => {
      if (route.name === "home") {
        getActiveOrder().then((result) => {
          model.activeOrder = result;
          setInterval(calcTimeDiff, 1000);
        });
        getSelectedOrder();
        started = true;
      }
    };
    onMounted(() => {
      if (!started) refresh();
      setInterval(refresh, 2000);
    });

    return {
      ld: _,
      model,
      timeDiff,
      progressBatchPercent,
      activeBatch,
      selectedOrder: selected,
      filteredGroups,
      hasDosingError,
      getTargetTotal,
      getConsumptionTotal,
      getDiffTotal,
      getDiffPercentTotal,
    };
  },
});
</script>
<style lang="scss" scoped>
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
.info-box {
  label {
    font-weight: bold;
    color: #999;
  }
}
.card-meta {
  border: 1px solid rgb(238, 238, 238);
  padding: 10px;
  margin-bottom: 20px;
}
</style>
