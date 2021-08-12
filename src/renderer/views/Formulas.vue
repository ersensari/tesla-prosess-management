<template>
  <div style="height: 100%" v-if="!editMode">
    <a-table
      :columns="columns"
      :data-source="formulas"
      :pagination="{ pageSize: 20 }"
      :scroll="{ y: 'calc(100vh - 225px)' }"
      :rowKey="(r) => r.id"
      style="height: 100%"
      class="ant-table-striped"
      :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :bordered="true"
    >
      <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
        <div style="padding: 8px">
          <a-input
            ref="searchInput"
            :placeholder="`Bul: ${column.title}`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
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
          <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)"> Temizle </a-button>
        </div>
      </template>
      <template #filterIcon="filtered">
        <SearchOutlined :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template>
      <template #customRender="{ text, column }">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))">
            <mark v-if="fragment.toLowerCase() === searchText.toLowerCase()" class="highlight" :key="i">
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
        <div style="margin-left: 16px">
          <a-tooltip placement="topLeft">
            <template #title>
              <span>Yeni Formül Ekle</span>
            </template>
            <a-button type="primary" shape="circle" size="small" @click="onNewClick()">
              <template #icon><PlusCircleOutlined /></template>
            </a-button>
          </a-tooltip>
        </div>
      </template>
      <template #operations="{ record }">
        <div style="display: flex; gap: 0.5rem">
          <a-popconfirm v-if="formulas.length" title="Silmek istediğinizden emin misiniz?" @confirm="onDeleteClick(record.id)">
            <a-tooltip placement="topLeft">
              <template #title>
                <span>Sil</span>
              </template>

              <a-button type="danger" shape="circle" size="small">
                <template #icon><DeleteOutlined /></template>
              </a-button>
            </a-tooltip>
          </a-popconfirm>
          <a-tooltip placement="topLeft">
            <template #title>
              <span>Düzenle</span>
            </template>

            <a-button type="primary" shape="circle" size="small" title="Düzenle" @click="onEditClick(record)">
              <template #icon><EditOutlined /></template>
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
  <div style="height: 100%" v-else-if="editMode">
    <a-card :title="editModalTitle">
      <a-form layout="horizontal">
        <a-row>
          <a-col span="17">
            <!-- Formül Genel Bilgiler -->
            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="Formül Adı"
                  v-bind="validateInfos['form.name']"
                  :label-col="{
                    span: 3,
                  }"
                  :wrapper-col="{
                    span: 21,
                  }"
                >
                  <a-input v-model:value="modelRef.form.name" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="6">
                <a-form-item
                  label="Formül No"
                  v-bind="validateInfos['form.formulaNo']"
                  :label-col="{
                    span: 10,
                  }"
                  :wrapper-col="{
                    span: 14,
                  }"
                >
                  <a-input v-model:value="modelRef.form.formulaNo" />
                </a-form-item>

                <a-form-item
                  label="Versiyon"
                  v-bind="validateInfos['form.version']"
                  :label-col="{
                    span: 10,
                  }"
                  :wrapper-col="{
                    span: 14,
                  }"
                >
                  <a-input-number :precision="0" v-model:value="modelRef.form.version" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  label="Tarih"
                  v-bind="validateInfos['form.formulaDate']"
                  :label-col="{
                    span: 10,
                  }"
                  :wrapper-col="{
                    span: 14,
                  }"
                >
                  <a-date-picker
                    v-model:value="modelRef.form.formulaDate"
                    type="date"
                    placeholder="Tarih Seçiniz"
                    style="width: 100%"
                    :locale="locale"
                    :format="$filters.formatDate"
                    valueFormat="YYYY-MM-DD"
                  />
                </a-form-item>

                <a-form-item
                  label="SAP Kodu"
                  v-bind="validateInfos['form.sapCode']"
                  :label-col="{
                    span: 10,
                  }"
                  :wrapper-col="{
                    span: 14,
                  }"
                >
                  <a-input v-model:value="modelRef.form.sapCode" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="Kısa Adı"
                  v-bind="validateInfos['form.shortName']"
                  :label-col="{
                    span: 5,
                  }"
                  :wrapper-col="{
                    span: 19,
                  }"
                >
                  <a-input v-model:value="modelRef.form.shortName" />
                </a-form-item>
                <a-form-item
                  label="Açıklama"
                  :label-col="{
                    span: 5,
                  }"
                  :wrapper-col="{
                    span: 19,
                  }"
                >
                  <a-input v-model:value="modelRef.form.explanation" />
                </a-form-item>
              </a-col>
            </a-row>
            <!-- Dozaj Grupları -->
            <a-row type="flex" :gutter="[4, 4]">
              <a-col :span="24" v-for="group in dosingGroupItems" :key="group.id">
                <a-card :bordered="true" size="small" style="width: 100%">
                  <a-card-meta>
                    <template #title>
                      <div style="display: flex; justify-content: space-between">
                        <h3>{{ group.name }}</h3>
                        <a-button
                          v-if="group.manual"
                          shape="round"
                          type="primary"
                          title="Ekle"
                          size="small"
                          @click="onAddManualAdditiveClick(group.id)"
                          >Ekle
                          <template #icon>
                            <PlusCircleOutlined />
                          </template>
                        </a-button>
                      </div>
                    </template>
                  </a-card-meta>
                  <table style="width: 100%; font-size: 0.8em">
                    <thead>
                      <tr>
                        <th v-if="group.manual" style="width: 35px"></th>
                        <th style="width: 70px">Dozaj Sıra</th>
                        <th v-if="!group.manual" style="width: 50px">Silo No</th>
                        <th style="width: 100px">Mal.Kodu</th>
                        <th>Mal.Adı</th>
                        <th style="width: 80px">Miktar</th>
                        <th v-if="!group.manual" style="width: 80px">Bit.Kesme</th>
                        <th v-if="!group.manual" style="width: 80px">B.Kesme.Mik.</th>
                        <th v-if="!group.manual" style="width: 80px">A.Kesme</th>
                        <th v-if="!group.manual" style="width: 80px">Tol.(kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="detail in ld(modelRef.form.Details).filter((x) => x.groupId === group.id)"
                        :key="detail.id"
                        :style="setDetailRowStyle(detail)"
                      >
                        <td v-if="group.manual">
                          <a-button
                            type="danger"
                            shape="circle"
                            size="small"
                            @click="onRemoveManualAdditiveClick(detail.dosingOrder, group.id)"
                          >
                            <template #icon>
                              <MinusCircleOutlined />
                            </template>
                          </a-button>
                        </td>
                        <td>
                          <a-select v-model:value="detail.dosingOrder" style="width: 60px" v-if="!group.manual">
                            <a-select-option key="0" value="0">0</a-select-option>
                            <a-select-option
                              v-for="i in modelRef.form.Details.filter((x) => x.groupId === group.id).length"
                              :value="i"
                              :key="i"
                              :disabled="
                                i !== 0 && modelRef.form.Details.filter((x) => x.groupId === group.id).some((x) => x.dosingOrder === i)
                              "
                              >{{ i }}</a-select-option
                            >
                          </a-select>
                          <span v-else>{{ detail.dosingOrder }}</span>
                        </td>
                        <td v-if="!group.manual">
                          {{ detail.Silo.row }}
                          <a-tooltip v-if="checkSiloRawMaterial(detail) && detail.Silo.RawMaterial">
                            <template #title>
                              Silo Malzemesi : {{ detail.Silo.RawMaterial.name }}<br />
                              Silo malzeme uyuşmazlığı var!
                            </template>
                            <WarningOutlined :style="{ fontSize: '16px', color: 'white' }" />
                          </a-tooltip>
                        </td>
                        <td>
                          {{ detail.RawMaterial.rawNo }}
                        </td>
                        <td>
                          {{ detail.RawMaterial.name }}
                        </td>
                        <td>
                          <a-input-number size="small" v-model:value="detail.amount" :precision="3" :min="0" style="width: 80px" />
                        </td>

                        <td v-if="!group.manual">
                          <a-input-number size="small" v-model:value="detail.shutoff1" :precision="3" style="width: 80px" :min="0" />
                        </td>
                        <td v-if="!group.manual">
                          <a-input-number size="small" v-model:value="detail.shutoff2" :precision="3" :min="0" style="width: 80px" />
                        </td>
                        <td v-if="!group.manual">
                          <a-input-number size="small" v-model:value="detail.shutoff3" :precision="3" :min="0" style="width: 80px" />
                        </td>
                        <td v-if="!group.manual">
                          <a-input-number size="small" v-model:value="detail.tolerance" :precision="3" :min="0" style="width: 80px" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </a-card>
              </a-col>
            </a-row>
          </a-col>
          <!--Parametreler-->
          <a-col :span="7">
            <a-card title="Parametreler" :bordered="true" style="margin-left: 1rem; width: 100%; margin-bottom: 3px">
              <a-form-item
                label="Örnek kontrolü"
                v-bind="validateInfos['form.sampleRate']"
                :label-col="{
                  span: 16,
                }"
                :wrapper-col="{
                  span: 8,
                }"
              >
                <a-select v-model:value="modelRef.form.sampleRate" style="width: 120px">
                  <a-select-option :value="0">Alma</a-select-option>
                  <a-select-option :value="1">Her Partide</a-select-option>
                  <a-select-option :value="2">Son Partide</a-select-option>
                  <a-select-option :value="3">5 Partide Bir</a-select-option>
                  <a-select-option :value="4">10 Partide Bir</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item
                label="Mikser Alt Kapak Açma Süresi"
                v-bind="validateInfos['form.mixerBottomCoverOpeningTime']"
                :label-col="{
                  span: 16,
                }"
                :wrapper-col="{
                  span: 8,
                }"
              >
                <a-input-number
                  v-model:value="modelRef.form.mixerBottomCoverOpeningTime"
                  :min="0"
                  :max="5000"
                  :step="1"
                  :precision="0"
                  :formatter="(value) => `${value}sn`"
                  :parser="(value) => value.replace(/s|n/g, '')"
                />
              </a-form-item>
              <a-form-item
                label="Mikser Düşük Hız Çalışma Set"
                v-bind="validateInfos['form.mixerLowSpeedRunSet']"
                :label-col="{
                  span: 16,
                }"
                :wrapper-col="{
                  span: 8,
                }"
              >
                <a-input-number
                  v-model:value="modelRef.form.mixerLowSpeedRunSet"
                  :min="0"
                  :max="100"
                  :step="1"
                  :precision="0"
                  :formatter="(value) => `${value}%`"
                  :parser="(value) => value.replace('%', '')"
                /> </a-form-item
              ><a-form-item
                label="Mikser Yüksek Hız Çalışma Set"
                v-bind="validateInfos['form.mixerHighSpeedRunSet']"
                :label-col="{
                  span: 16,
                }"
                :wrapper-col="{
                  span: 8,
                }"
              >
                <a-input-number
                  v-model:value="modelRef.form.mixerHighSpeedRunSet"
                  :min="0"
                  :max="100"
                  :step="1"
                  :precision="0"
                  :formatter="(value) => `${value}%`"
                  :parser="(value) => value.replace('%', '')"
                />
              </a-form-item>
              <a-form-item
                label="Mikser Karıştırma Süresi"
                v-bind="validateInfos['form.mixerMixTime']"
                :label-col="{
                  span: 16,
                }"
                :wrapper-col="{
                  span: 8,
                }"
              >
                <a-input-number
                  v-model:value="modelRef.form.mixerMixTime"
                  :min="0"
                  :max="5000"
                  :step="1"
                  :precision="0"
                  :formatter="(value) => `${value}sn`"
                  :parser="(value) => value.replace(/s|n/g, '')"
                />
              </a-form-item>
              <a-form-item
                label="Chopper Motorlar Çalışma Süresi"
                v-bind="validateInfos['form.chopperEnginesRuningTime']"
                :label-col="{
                  span: 16,
                }"
                :wrapper-col="{
                  span: 8,
                }"
              >
                <a-input-number
                  v-model:value="modelRef.form.chopperEnginesRuningTime"
                  :min="0"
                  :max="5000"
                  :step="1"
                  :precision="0"
                  :formatter="(value) => `${value}sn`"
                  :parser="(value) => value.replace(/s|n/g, '')"
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
                <a-check v-model:checked="modelRef.form.chopperEngine1Permit"></a-check>
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
                <a-check v-model:checked="modelRef.form.dustExtractionPermit"></a-check>
              </a-form-item>
              <a-form-item
                label="Ham Dz2 Kantar Önce"
                :label-col="{
                  span: 16,
                }"
                :wrapper-col="{
                  span: 8,
                }"
              >
                <a-check v-model:checked="modelRef.form.chopperEngine2Permit"></a-check>
              </a-form-item>
            </a-card>
            <!--Toplamlar-->
            <a-card title="Toplamlar" :bordered="true" style="margin-left: 1rem; width: 100%; margin-bottom: 3px">
              <table style="width: 100%">
                <tbody>
                  <tr v-for="group in dosingGroupItems" :key="group.id" style="border-bottom: 1px solid #ccc">
                    <th>{{ group.name }}</th>
                    <td>{{ getGroupTotal(group.id) }}</td>
                  </tr>
                  <tr style="border-top: 2px solid #333">
                    <th>Genel Toplam</th>
                    <td>{{ getGroupTotal(-1) }}</td>
                  </tr>
                </tbody>
              </table>
            </a-card>
          </a-col>
        </a-row>
      </a-form>

      <template #extra>
        <span style="padding: 3px">
          <a-button key="back" @click="onModalCancelClick" :disabled="loading">İptal</a-button>
        </span>
        <span style="padding: 3px">
          <a-dropdown-button @click.prevent="onModalSaveClick" type="primary">
            Kaydet
            <template #overlay>
              <a-menu>
                <a-menu-item key="1" @click="onModalSaveAsClick" :disabled="!modelRef.form.id || modelRef.form.id === 0"
                  >Farklı Kaydet</a-menu-item
                >
              </a-menu>
            </template>
          </a-dropdown-button>

          <!-- <a-button
            key="submit"
            type="primary"
            :loading="loading"
            @click.prevent="onModalSaveClick"
            v-if="!modelRef.form.id || modelRef.form.id !== 0"
            >Kaydet</a-button> -->
        </span>
      </template>
    </a-card>
  </div>
  <raw-materials-modal
    :visible="rawMaterialsSelectModalVisible"
    @onRawMaterialSelect="onRawMaterialSelect"
    @onRawMaterialCancel="onRawMaterialCancel"
  />
</template>
<script>
import locale from 'ant-design-vue/es/date-picker/locale/tr_TR';
import _ from 'lodash';
import { computed, defineComponent, onMounted, reactive, ref, toRaw, watch } from 'vue';
import {
  Table,
  Button,
  Input,
  InputNumber,
  Popconfirm,
  Modal,
  Tooltip,
  Form,
  notification as showNotify,
  DatePicker,
  Col,
  Row,
  Card,
  Checkbox,
  Select,
  Icon,
  Dropdown,
  Menu,
} from 'ant-design-vue';
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  WarningOutlined,
  DownOutlined,
} from '@ant-design/icons-vue';
import { useForm } from '@ant-design-vue/use';
import { useState, useActions, useMutations } from '@/store/hooks';
import RawMaterialsModal from './RawMaterialsModal';
export default defineComponent({
  name: 'Formulas',
  components: {
    'raw-materials-modal': RawMaterialsModal,
    'a-table': Table,
    'a-button': Button,
    'a-input': Input,
    'a-input-number': InputNumber,
    'a-popconfirm': Popconfirm,
    'a-modal': Modal,
    'a-tooltip': Tooltip,
    'a-form': Form,
    'a-form-item': Form.Item,
    'a-date-picker': DatePicker,
    'a-row': Row,
    'a-col': Col,
    'a-card': Card,
    'a-card-meta': Card.Meta,
    'a-check': Checkbox,
    'a-select': Select,
    'a-select-option': Select.Option,
    'a-icon': Icon,
    'a-dropdown': Dropdown,
    'a-dropdown-button': Dropdown.Button,
    'a-menu': Menu,
    'a-menu-item': Menu.Item,
    SearchOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    WarningOutlined,
    DownOutlined,
  },
  setup() {
    const searchText = ref('');
    const searchedColumn = ref('');
    const searchInput = ref();
    const editModalTitle = ref('');
    const rawMaterialsSelectModalVisible = ref(false);

    const { formulas, loading, notification, editMode } = useState(['formulas', 'loading', 'notification', 'editMode'], 'formula');
    const { findAll, save, update, remove } = useActions(['findAll', 'save', 'update', 'remove'], 'formula');

    const dosingGroup = useActions(['findAll'], 'dosingGroup');
    const { items: dosingGroupItems } = useState(['items'], 'dosingGroup');

    const { setEditMode } = useMutations(['setEditMode'], 'formula');
    const modelRef = reactive({
      form: {
        id: undefined,
        formulaNo: '', //DataTypes.STRING,
        version: '', //DataTypes.STRING,
        name: '', //DataTypes.STRING,
        shortName: '', // DataTypes.STRING,
        explanation: '', //DataTypes.STRING,
        formulaDate: '', //DataTypes.DATE,
        sapCode: '', //DataTypes.STRING,
        sampleRate: 0, //DataTypes.INTEGER,
        mixerBottomCoverOpeningTime: 0, // DataTypes.INTEGER,
        mixerLowSpeedRunSet: 0, //DataTypes.INTEGER,
        mixerHighSpeedRunSet: 0, //DataTypes.INTEGER,
        mixerMixTime: 0, //DataTypes.INTEGER,
        chopperEnginesRuningTime: 0, //DataTypes.INTEGER,
        chopperEngine1Permit: false, //DataTypes.BOOLEAN,
        chopperEngine2Permit: false, //DataTypes.BOOLEAN,
        chopperEngine3Permit: false, //DataTypes.BOOLEAN,
        dustExtractionPermit: false, //DataTypes.BOOLEAN,
        Details: [],
      },
    });

    const rulesRef = reactive({
      'form.name': [{ required: true, message: 'Formül Adı Zorunlu.', type: 'string' }],
      'form.shortName': [{ required: true, message: 'Formül Kısa Adı Zorunlu.', type: 'string' }],
      'form.sapCode': [{ required: true, message: 'SAP Kodu Zorunlu.', type: 'string' }],
      'form.version': [{ required: true, message: 'Versiyon No Zorunlu.', type: 'integer' }],
      'form.formulaNo': [{ required: true, message: 'Formül No Zorunlu.', type: 'string' }],
      'form.formulaDate': [{ required: true, message: 'Formül Tarihi Zorunlu.', type: 'date' }],
      'form.sampleRate': [
        {
          required: true,
          message: 'Örnek Zorunlu.',
          type: 'integer',
        },
      ],
      'form.mixerBottomCoverOpeningTime': [
        {
          required: true,
          message: 'Mikser Alt Kapak Açılma Zamanı Zorunlu.',
          type: 'integer',
        },
      ],
      'form.mixerLowSpeedRunSet': [
        {
          required: true,
          message: 'Mikser Düşük Hız Çalışma Set Zorunlu.',
          type: 'integer',
        },
      ],
      'form.mixerHighSpeedRunSet': [
        {
          required: true,
          message: 'Mikser Yüksek Hız Çalışma Set Zorunlu.',
          type: 'integer',
        },
      ],
      'form.mixerMixTime': [
        {
          required: true,
          message: 'Mikser Karıştırma Süresi Zorunlu.',
          type: 'integer',
        },
      ],
      'form.chopperEnginesRuningTime': [
        {
          required: true,
          message: 'Chopper Motorların Süresi Zorunlu.',
          type: 'integer',
        },
      ],
    });

    const { validate, validateInfos, resetFields } = useForm(modelRef, rulesRef);

    const filterMethods = (columnName) => {
      return {
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        sorter: (a, b) => a[columnName].length - b[columnName].length,
        sortDirections: ['descend', 'ascend'],
        onFilter: (value, record) => record[columnName].toString().toLowerCase().includes(value.toLowerCase()),
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
        width: 85,
        key: 'operations',
        slots: { customRender: 'operations', title: 'newButton' },
      },
      {
        title: 'Formül No',
        dataIndex: 'formulaNo',
        key: 'formulaNo',
        width: 140,
        ...filterMethods('formulaNo'),
      },
      {
        title: 'Ver.',
        dataIndex: 'version',
        key: 'version',
        width: 100,
        ...filterMethods('version'),
      },
      {
        title: 'SAP Kodu',
        dataIndex: 'sapCode',
        key: 'sapCode',
        width: 150,
        ...filterMethods('sapCode'),
      },
      {
        title: 'Tam Adı',
        dataIndex: 'name',
        key: 'name',
        width: 300,
        ...filterMethods('name'),
      },
      {
        title: 'Kısa Adı',
        dataIndex: 'shortName',
        key: 'shortName',
        width: 150,
        ...filterMethods('shortName'),
      },
      {
        title: 'Tarih',
        dataIndex: 'formulaDate',
        key: 'formulaDate',
        width: 120,
        slots: {
          customRender: 'formulaDate',
        },
      },
      {
        title: 'Açıklama',
        dataIndex: 'explanation',
        key: 'explanation',
        ellipsis: true,
        ...filterMethods('explanation'),
      },
      {
        title: 'Toplam',
        dataIndex: 'total',
        key: 'total',
        width: 100,
        slots: {
          customRender: 'totalAmount',
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
      searchText.value = '';
    };

    const onNewClick = () => {
      resetFields();
      editModalTitle.value = 'Yeni Ekle';
      setEditMode(true);
      if (dosingGroupItems.value.length > 0) {
        const details = dosingGroupItems.value.flatMap((x) =>
          x.Silos.map((s) => {
            return {
              id: undefined,
              formulaId: undefined,
              groupId: x.id,
              siloId: s.id,
              Silo: s,
              rawMaterialId: s.rawMaterialId,
              RawMaterial: s.RawMaterial,
              dosingOrder: 0,
              amount: 0,
              shutoff1: 0,
              shutoff2: 0,
              shutoff3: 0,
              tolerance: 0,
            };
          })
        );
        modelRef.form.Details = details;
      }
    };

    const onEditClick = (item) => {
      const details = dosingGroupItems.value.flatMap((x) =>
        x.Silos.map((s) => {
          const detail = item.Details.find((d) => d.dosingOrder > 0 && d.groupId === x.id && d.siloId === s.id);
          return detail
            ? detail
            : {
                id: undefined,
                formulaId: item.id,
                groupId: x.id,
                siloId: s.id,
                Silo: s,
                rawMaterialId: s.rawMaterialId,
                RawMaterial: s.RawMaterial,
                dosingOrder: 0,
                amount: 0,
                shutoff1: 0,
                shutoff2: 0,
                shutoff3: 0,
                tolerance: 0,
              };
        })
      );
      item.Details = details.concat(item.Details.filter((d) => d.dosingOrder > 0 && d.siloId === null && d.DosingGroup.manual));
      modelRef.form = item;
      setEditMode(true);
      editModalTitle.value = 'Düzenle';
    };
    const onModalSaveClick = () => {
      validate()
        .then(() => {
          modelRef.form.Details = modelRef.form.Details.filter((x) => x.dosingOrder !== 0);

          if (modelRef.form.id) {
            update(toRaw(modelRef.form)).then((result) => {
              findAll();
              modelRef.form = result;
            });
          } else {
            save(toRaw(modelRef.form)).then((result) => {
              findAll();
              modelRef.form = result;
            });
          }

          modelRef.form.Details.map((x) => {
            if (x.deleted) {
              const itemIndex = modelRef.form.Details.findIndex((d) => d.id == x.id);
              modelRef.form.Details.splice(itemIndex, 1);
            }
          });
        })
        .catch((err) => {
          showNotify['error']({
            message: 'Veri giriş hatası!',
            description: 'Lütfen formu kontrol ediniz. \r\n' + err.message,
          });
        });
    };

    const onModalSaveAsClick = () => {
      validate()
        .then(() => {
          const maxVer = _.maxBy(
            formulas.value.filter(
              (x) => x.formulaNo === modelRef.form.formulaNo && x.name === modelRef.form.name && x.sapCode === modelRef.form.sapCode
            ),
            'version'
          ).version;

          modelRef.form.name = 'KOPYASI ' + modelRef.form.name;
          modelRef.form.version = maxVer + 1;
          modelRef.form.id = null;
          modelRef.form.createdAt = undefined;
          modelRef.form.updatedAt = undefined;
          modelRef.form.Details = modelRef.form.Details.filter((x) => x.dosingOrder !== 0);

          modelRef.form.Details.map((x) => {
            if (x.deleted) {
              const itemIndex = modelRef.form.Details.findIndex((d) => d.id == x.id);
              modelRef.form.Details.splice(itemIndex, 1);
            }
          });

          modelRef.form.Details.filter((x) => !x.DosingGroup.manual).map((x) => {
            x.rawMaterialId = x.Silo.rawMaterialId;
            x.id = undefined;
            x.formulaId = undefined;
            x.createdAt = undefined;
            x.updatedAt = undefined;
          });

          save(toRaw(modelRef.form))
            .then((result) => {
              findAll();
              modelRef.form = result;
            })
            .catch((err) => {
              throw new Exception(err.message);
            });
        })
        .catch((err) => {
          showNotify['error']({
            message: 'Veri giriş hatası!',
            description: 'Lütfen formu kontrol ediniz. \r\n' + err.message,
          });
        });
    };

    const onModalCancelClick = () => {
      setEditMode(false);
    };

    const onDeleteClick = (id) => {
      remove(id);
    };

    let selectedManualGroupId = null;
    const onAddManualAdditiveClick = (groupId) => {
      rawMaterialsSelectModalVisible.value = true;
      selectedManualGroupId = groupId;
    };

    const onRemoveManualAdditiveClick = (order, groupId) => {
      const itemIndex = modelRef.form.Details.findIndex((x) => x.groupId === groupId && x.dosingOrder === order);
      const item = modelRef.form.Details[itemIndex];

      if (item !== null) {
        if (item.id !== null) {
          modelRef.form.Details[itemIndex].deleted = true;
        } else {
          modelRef.form.Details.splice(itemIndex, 1);
        }
        modelRef.form.Details.filter((x) => x.groupId === groupId).map((x, i) => {
          if (x.deleted) {
            x.dosingOrder = -1;
          }
        });

        _.orderBy(
          modelRef.form.Details.filter((x) => x.groupId === groupId && x.dosingOrder > 0),
          (x) => x.dosingOrder
        ).map((x, i) => {
          x.dosingOrder = i + 1;
        });
      }
    };
    const onRawMaterialSelect = (rawMaterial) => {
      rawMaterialsSelectModalVisible.value = false;
      addManualAdditive(selectedManualGroupId, rawMaterial);
    };
    const onRawMaterialCancel = () => {
      rawMaterialsSelectModalVisible.value = false;
    };
    const addManualAdditive = (groupId, rawMaterial) => {
      const order = Math.max(...modelRef.form.Details.filter((x) => x.groupId === groupId).map((x) => x.dosingOrder), 0) + 1;
      modelRef.form.Details.push({
        id: undefined,
        formulaId: modelRef.form.id,
        groupId: groupId,
        siloId: null,
        rawMaterialId: rawMaterial.id,
        RawMaterial: rawMaterial,
        dosingOrder: order,
        amount: 0,
        shutoff1: 0,
        shutoff2: 0,
        shutoff3: 0,
        tolerance: 0,
      });
    };

    const calcGroupTotal = computed(() => {
      const totals = _(modelRef.form.Details)
        .groupBy((x) => x.groupId)
        .map(function (g, key) {
          return {
            groupId: parseInt(key),
            sum: _.round(
              _(g).reduce(function (m, x) {
                return m + x.amount;
              }, 0),
              3
            ),
          };
        })
        .value();

      return totals;
    });

    const getGroupTotal = (groupid) => {
      if (groupid === -1) {
        return _.round(
          _(calcGroupTotal.value).sumBy((x) => x.sum),
          3
        );
      }

      const g = calcGroupTotal.value.find((x) => x.groupId === groupid);
      if (!g) {
        return 0;
      }
      return _.round(g.sum, 3);
    };

    const checkSiloRawMaterial = (detail) => detail.Silo && detail.dosingOrder > 0 && detail.rawMaterialId !== detail.Silo.rawMaterialId;

    const setDetailRowStyle = (detail) => {
      let style = {};
      if (detail.deleted) {
        style = {
          'background-color': 'red',
        };
      }

      if (detail.Silo && detail.dosingOrder > 0 && detail.rawMaterialId !== detail.Silo.rawMaterialId) {
        style = {
          'background-color': '#ff5349',
        };
      }

      return style;
    };

    watch(notification, (notify) => {
      showNotify[notify.type]({
        message: notify.message,
        description: notify.description,
      });
    });

    onMounted(() => {
      findAll();
      dosingGroup.findAll();
      setEditMode(false);
    });

    const getFormulaTotalAmount = (formula) =>
      _.round(
        _(formula.Details)
          .filter((x) => x.dosingOrder >= 0)
          .sumBy((x) => x.amount),
        3
      );
    return {
      ld: _,
      formulas,
      dosingGroupItems,
      columns,
      handleSearch,
      handleReset,
      searchText,
      searchInput,
      searchedColumn,
      editMode,
      onEditClick,
      onModalSaveClick,
      onModalCancelClick,
      onDeleteClick,
      onNewClick,
      onAddManualAdditiveClick,
      onRemoveManualAdditiveClick,
      onRawMaterialSelect,
      onRawMaterialCancel,
      editModalTitle,
      loading,
      validate,
      validateInfos,
      modelRef,
      notification,
      locale,
      rawMaterialsSelectModalVisible,
      getGroupTotal,
      setDetailRowStyle,
      checkSiloRawMaterial,
      getFormulaTotalAmount,
      calcGroupTotal,
      onModalSaveAsClick,
    };
  },
});
</script>
