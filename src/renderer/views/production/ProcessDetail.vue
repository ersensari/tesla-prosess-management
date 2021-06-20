<template>
  <table
    style="
      width: 100%;
      font-size: 0.8em;
      border: 1px solid rgb(235, 235, 235);
      border-collapse: collapse;
    "
  >
    <thead>
      <tr>
        <th style="width: 60px; text-align: center">Sıra No</th>
        <th style="width: 60px; text-align: center">Silo No</th>
        <th>Hammadde</th>
        <th style="width: 100px">Hedef Miktar</th>
        <th style="width: 100px">Gerçek Miktar</th>
        <th style="width: 100px">Fark</th>
        <th style="width: 100px">Fark (%)</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="detail in details"
        :key="detail.id"
        :style="{
          backgroundColor: hasDosingError(detail)
            ? 'rgb(255,238,244)'
            : 'transparent',
        }"
      >
        <td style="text-align: center">{{ detail.dosingOrder }}</td>
        <td style="text-align: center" v-if="detail.Silo">
          {{ detail.Silo.row }}
        </td>
        <td style="text-align: center" v-else>Manual</td>
        <td>{{ detail.RawMaterial.name }}</td>
        <td>
          {{ detail.amount }}
        </td>
        <td>{{ round(detail.consumptionAmount, 3) }}</td>
        <td>{{ round(detail.consumptionAmount - detail.amount, 3) }}</td>
        <td>
          {{
            round(
              ((detail.consumptionAmount - detail.amount) / detail.amount) *
                100,
              2
            )
          }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { round } from "lodash";
import { Card } from "ant-design-vue";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "ProcessDetail",
  components: {
    "a-card": Card,
  },
  props: {
    details: {
      type: Array,
      required: true,
    },
    hasDosingError: {
      type: Function,
    },
  },
  setup(props) {
    return {
      round,
    };
  },
});
</script>

<style></style>
