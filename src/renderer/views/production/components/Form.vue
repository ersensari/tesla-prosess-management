<template>
  <a-card :title="editModalTitle" height="100%" v-if="model !== null">
    <a-form
      layout="horizontal"
      ref="prodForm"
      :model="model"
      :rules="formRules"
    >
      <a-row>
        <a-col span="17">
          <!-- Formül Genel Bilgiler -->
          <table class="formula-general-information">
            <tr>
              <th style="width: 100px; text-align: right">Formül Adı:</th>
              <td colspan="5">{{ model.name }}</td>
            </tr>
            <tr>
              <th style="width: 100px; text-align: right">Formül No:</th>
              <td>{{ model.formulaNo }}</td>
              <th style="width: 100px; text-align: right">Tarih:</th>
              <td style="width: 200px; text-align: left">
                {{ $filters.formatDate(model.formulaDate) }}
              </td>
              <th style="width: 100px; text-align: right">Kısa Adı:</th>
              <td>{{ model.shortName }}</td>
            </tr>
            <tr>
              <th style="width: 100px; text-align: right">Versiyon:</th>
              <td>{{ model.version }}</td>
              <th style="width: 100px; text-align: right">SAP Kodu:</th>
              <td style="width: 200px; text-align: left">
                {{ model.sapCode }}
              </td>
              <th style="width: 100px; text-align: right">Açıklama:</th>
              <td>{{ model.explanation }}</td>
            </tr>
          </table>
          <!-- Dozaj Grupları -->
          <a-row
            type="flex"
            :gutter="[4, 4]"
            v-if="dosingGroupItems.length > 0"
          >
            <a-col :span="24" v-for="group in dosingGroupItems" :key="group.id">
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
                      <h3>{{ group.name }}</h3>
                      <h5>Toplam: {{ getGroupTotal(group.id) }} kg.</h5>
                    </div>
                  </template>
                </a-card-meta>
                <table style="width: 100%; font-size: 0.8em">
                  <thead>
                    <tr>
                      <th style="width: 70px">Dozaj Sıra</th>
                      <th v-if="!group.manual" style="width: 50px">Silo No</th>
                      <th style="width: 100px">Mal.Kodu</th>
                      <th>Mal.Adı</th>
                      <th style="width: 80px">Miktar</th>
                      <th v-if="!group.manual" style="width: 80px">
                        Bit.Kesme
                      </th>
                      <th v-if="!group.manual" style="width: 80px">
                        B.Kesme.Mik.
                      </th>
                      <th v-if="!group.manual" style="width: 80px">A.Kesme</th>
                      <th v-if="!group.manual" style="width: 80px">Tol.(kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="detail in formulaDetails(group.id)"
                      :key="detail.id"
                      :style="setDetailRowStyle(detail)"
                    >
                      <td>
                        {{ detail.dosingOrder }}
                      </td>
                      <td v-if="!group.manual">
                        {{ detail.Silo.row }}
                        <a-tooltip v-if="checkSiloRawMaterial(detail)">
                          <template #title>
                            Silo Malzemesi : {{ detail.Silo.RawMaterial.name
                            }}<br />
                            Silo malzeme uyuşmazlığı var!
                          </template>
                          <WarningOutlined
                            :style="{ fontSize: '16px', color: 'white' }"
                          />
                        </a-tooltip>
                      </td>
                      <td>{{ detail.RawMaterial.rawNo }}</td>
                      <td>{{ detail.RawMaterial.name }}</td>
                      <td>
                        {{ detail.amount }}
                      </td>

                      <td v-if="!group.manual">
                        {{ detail.shutoff1 }}
                      </td>
                      <td v-if="!group.manual">
                        {{ detail.shutoff2 }}
                      </td>
                      <td v-if="!group.manual">
                        {{ detail.shutoff3 }}
                      </td>
                      <td v-if="!group.manual">
                        {{ detail.tolerance }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </a-card>
            </a-col>

            <a-col :span="24">
              <a-card :bordered="true" size="small" style="width: 100%">
                <a-card-meta>
                  <template #title>
                    <div
                      style="
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                      "
                    >
                      <h4>Genel Toplam: {{ getGroupTotal(-1) }} kg.</h4>
                    </div>
                  </template>
                </a-card-meta>
              </a-card>
            </a-col>
          </a-row>
        </a-col>
        <!--Parametreler-->
        <a-col :span="7">
          <a-card
            title="Üretim Bilgileri ve Parametreler"
            :bordered="true"
            style="margin-left: 1rem; width: 100%; margin-bottom: 3px"
          >
            <a-form-item
              label="Üretim Tarihi"
              name="productionDate"
              :label-col="{
                span: 10,
              }"
              :wrapper-col="{
                span: 14,
              }"
            >
              <a-date-picker
                v-model:value="model.productionDate"
                type="date"
                placeholder="Tarih Seçiniz"
                style="width: 100%"
                :locale="locale"
                :format="$filters.formatDate"
                valueFormat="YYYY-MM-DD"
              />
            </a-form-item>

            <a-form-item
              label="Örnek kontrolü"
              :label-col="{
                span: 10,
              }"
              :wrapper-col="{
                span: 14,
              }"
            >
              <a-select v-model:value="model.sampleRate" style="width: 100%">
                <a-select-option :value="0">Alma</a-select-option>
                <a-select-option :value="1">Her Partide</a-select-option>
                <a-select-option :value="2">Son Partide</a-select-option>
                <a-select-option :value="3">5 Partide Bir</a-select-option>
                <a-select-option :value="4">10 Partide Bir</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              label="Üretilecek Parti Sayısı"
              style="font-weight: bold"
              name="batchCount"
              :label-col="{
                span: 16,
              }"
              :wrapper-col="{
                span: 8,
              }"
            >
              <a-input-number
                v-model:value="model.batchCount"
                :min="1"
                :max="500"
              />
            </a-form-item>

            <a-form-item
              label="Mikser Alt Kapak Açma Süresi"
              name="mixerBottomCoverOpeningTime"
              :label-col="{
                span: 16,
              }"
              :wrapper-col="{
                span: 8,
              }"
            >
              <a-input-number
                v-model:value="model.mixerBottomCoverOpeningTime"
                :min="0"
                :max="5000"
                :formatter="(value) => `${value} sn`"
                :parser="(value) => value.replace('sn', '')"
              />
            </a-form-item>
            <a-form-item
              label="Mikser Düşük Hız Çalışma Set"
              name="mixerLowSpeedRunSet"
              :label-col="{
                span: 16,
              }"
              :wrapper-col="{
                span: 8,
              }"
            >
              <a-input-number
                v-model:value="model.mixerLowSpeedRunSet"
                :min="0"
                :max="100"
                :formatter="(value) => `${value} %`"
                :parser="(value) => value.replace('%', '')"
              /> </a-form-item
            ><a-form-item
              label="Mikser Yüksek Hız Çalışma Set"
              name="mixerHighSpeedRunSet"
              :label-col="{
                span: 16,
              }"
              :wrapper-col="{
                span: 8,
              }"
            >
              <a-input-number
                v-model:value="model.mixerHighSpeedRunSet"
                :min="0"
                :max="100"
                :formatter="(value) => `${value} %`"
                :parser="(value) => value.replace('%', '')"
              />
            </a-form-item>
            <a-form-item
              label="Mikser Karıştırma Süresi"
              name="mixerMixTime"
              :label-col="{
                span: 16,
              }"
              :wrapper-col="{
                span: 8,
              }"
            >
              <a-input-number
                v-model:value="model.mixerMixTime"
                :min="0"
                :max="5000"
                :formatter="(value) => `${value} sn`"
                :parser="(value) => value.replace('sn', '')"
              />
            </a-form-item>
            <a-form-item
              label="Chopper Motorlar Çalışma Süresi"
              name="chopperEnginesRuningTime"
              :label-col="{
                span: 16,
              }"
              :wrapper-col="{
                span: 8,
              }"
            >
              <a-input-number
                v-model:value="model.chopperEnginesRuningTime"
                :min="0"
                :max="5000"
                :formatter="(value) => `${value} sn`"
                :parser="(value) => value.replace('sn', '')"
              />
            </a-form-item>
            <a-form-item
              label="Chopper Motor İzin"
              :label-col="{
                span: 16,
              }"
              :wrapper-col="{
                span: 8,
              }"
            >
              <a-check v-model:checked="model.chopperEngine1Permit"></a-check>
            </a-form-item>
            <a-form-item
              label="Toz Toplama İzin"
              :label-col="{
                span: 16,
              }"
              :wrapper-col="{
                span: 8,
              }"
            >
              <a-check v-model:checked="model.dustExtractionPermit"></a-check>
            </a-form-item>
          </a-card>
        </a-col>
      </a-row>
    </a-form>

    <template #extra>
      <span style="padding: 3px">
        <a-button key="back" @click="onCancelClick" :disabled="loading"
          >İptal</a-button
        >
      </span>
      <span style="padding: 3px">
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click.prevent="onSaveClick"
          >Kaydet</a-button
        >
      </span>
    </template>
  </a-card>
</template>

<script>
import locale from "ant-design-vue/es/date-picker/locale/tr_TR";
import _ from "lodash";
import { computed, defineComponent, onMounted, ref, toRaw } from "vue";
import {
  Button,
  Input,
  InputNumber,
  Tooltip,
  Form,
  DatePicker,
  Col,
  Row,
  Card,
  Checkbox,
  Select,
  notification as showNotify,
} from "ant-design-vue";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons-vue";
import { useState, useActions, useMutations } from "@/store/hooks";
export default defineComponent({
  name: "Form",
  components: {
    "a-button": Button,
    "a-input": Input,
    "a-input-number": InputNumber,
    "a-tooltip": Tooltip,
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-date-picker": DatePicker,
    "a-row": Row,
    "a-col": Col,
    "a-card": Card,
    "a-card-meta": Card.Meta,
    "a-check": Checkbox,
    "a-select": Select,
    "a-select-option": Select.Option,
    PlusCircleOutlined,
    MinusCircleOutlined,
    WarningOutlined,
  },
  emits: ["onSaveCompleted"],
  setup(__, { emit }) {
    const { model, newMode, loading } = useState(
      ["model", "newMode", "loading"],
      "production"
    );
    const { save, update } = useActions(["save", "update"], "production");

    const { setFormMode } = useMutations(["setFormMode"], "production");
    const prodForm = ref();

    const formRules = {
      productionDate: [
        { required: true, message: "Üretim Tarihi Zorunlu.", type: "date" },
      ],
      sampleRate: [
        {
          required: true,
          message: "Örnek Zorunlu.",
          type: "integer",
        },
      ],
      batchCount: [
        {
          required: true,
          message: "Parti Sayısı Zorunlu.",
          type: "integer",
        },
      ],
      mixerBottomCoverOpeningTime: [
        {
          required: true,
          message: "Mikser Alt Kapak Açılma Zamanı Zorunlu.",
          type: "integer",
        },
      ],
      mixerLowSpeedRunSet: [
        {
          required: true,
          message: "Mikser Düşük Hız Çalışma Set Zorunlu.",
          type: "integer",
        },
      ],
      mixerHighSpeedRunSet: [
        {
          required: true,
          message: "Mikser Yüksek Hız Çalışma Set Zorunlu.",
          type: "integer",
        },
      ],
      mixerMixTime: [
        {
          required: true,
          message: "Mikser Karıştırma Süresi Zorunlu.",
          type: "integer",
        },
      ],
      chopperEnginesRuningTime: [
        {
          required: true,
          message: "Chopper Motorların Süresi Zorunlu.",
          type: "integer",
        },
      ],
    };

    const dosingGroup = useActions(["findAll"], "dosingGroup");
    const { items: dosingGroupItems } = useState(["items"], "dosingGroup");

    const calcGroupTotal = computed(() => {
      const totals = _(model.value.Details)
        .groupBy((x) => x.groupId)
        .map(function (g, key) {
          return {
            groupId: parseInt(key),
            sum: _(g).reduce(function (m, x) {
              return m + x.amount;
            }, 0),
          };
        })
        .value();

      return totals;
    });

    const getGroupTotal = (groupid) => {
      if (groupid === -1) {
        return _(calcGroupTotal.value).sumBy((x) => x.sum);
      }

      const g = calcGroupTotal.value.find((x) => x.groupId === groupid);
      if (!g) {
        return 0;
      }
      return g.sum;
    };

    // Silo ve Formul arasında malzeme uyuşmazlığı var mı?
    const hasDiscrepancySiloRawMaterial = () => {
      if (
        model.value &&
        model.value.Details !== null &&
        model.value.Details.length > 0
      ) {
        const hasErr = _(model.value.Details).some(
          (detail) =>
            detail.Silo && detail.rawMaterialId !== detail.Silo.rawMaterialId
        );
        return hasErr;
      } else return true;
    };

    const checkSiloRawMaterial = (detail) =>
      detail.Silo && detail.rawMaterialId !== detail.Silo.rawMaterialId;

    const setDetailRowStyle = (detail) => {
      let style = {};
      if (detail.deleted) {
        style = {
          "background-color": "red",
        };
      }

      if (detail.Silo && detail.rawMaterialId !== detail.Silo.rawMaterialId) {
        style = {
          "background-color": "#ff5349",
        };
      }

      return style;
    };

    const editModalTitle = computed(() => {
      if (newMode) {
        return "Yeni Üretim Emri Ekle";
      } else {
        return "Düzenle";
      }
    });
    const formulaDetails = (gid) => {
      const _details = _(model.value.Details)
        .filter((x) => x.groupId === gid)
        .sortBy((x) => x.dosingOrder);
      return _details;
    };

    const onSaveClick = () => {
      if (hasDiscrepancySiloRawMaterial()) {
        return showNotify["error"]({
          message: "Malzeme Uyuşmazlığı!",
          description:
            "Silo - Formül malzeme uyuşmazlığı var. Formülü kontrol ediniz.",
        });
      }
      prodForm.value
        .validate()
        .then(async () => {
          if (newMode.value) {
            await save(model.value);
          } else {
            await update(model.value);
          }
          emit("onSaveCompleted", model);
        })
        .catch((err) => {
          showNotify["error"]({
            message: "Veri giriş hatası!",
            description: "Lütfen formu kontrol ediniz.",
          });
        });
    };
    const onCancelClick = () => {
      setFormMode({ editMode: false, newMode: false, model: null });
    };

    onMounted(() => {
      dosingGroup.findAll();
    });

    return {
      locale,
      model,
      formRules,
      prodForm,
      formulaDetails,
      loading,
      dosingGroupItems,
      calcGroupTotal,
      getGroupTotal,
      checkSiloRawMaterial,
      setDetailRowStyle,
      onSaveClick,
      onCancelClick,
      editModalTitle,
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
