<template>
  <div style="height: 100%">
    <a-table
      :columns="columns"
      :data-source="items"
      :pagination="{ pageSize: 20 }"
      :scroll="{ y: 'calc(100vh - 225px)' }"
      :rowKey="(r) => r.id"
      style="height: 100%"
      class="ant-table-striped"
      :rowClassName="
        (record, index) => (index % 2 === 1 ? 'table-striped' : null)
      "
      :bordered="true"
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
        <div style="margin-left: 16px">
          <a-tooltip placement="topLeft">
            <template #title>
              <span>Yeni Hammadde Ekle</span>
            </template>
            <a-button
              type="primary"
              shape="circle"
              size="small"
              @click="onNewClick()"
            >
              <template #icon><PlusCircleOutlined /></template>
            </a-button>
          </a-tooltip>
        </div>
      </template>
      <template #operations="{ record }">
        <div style="display: flex; gap: 0.5rem">
          <a-popconfirm
            v-if="items.length"
            title="Silmek istediğinizden emin misiniz?"
            @confirm="onDeleteClick(record.id)"
          >
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

            <a-button
              type="primary"
              shape="circle"
              size="small"
              title="Düzenle"
              @click="onEditClick(record)"
            >
              <template #icon><EditOutlined /></template>
            </a-button>
          </a-tooltip>
        </div>
      </template>
    </a-table>

    <a-modal
      v-model:visible="editMode"
      :title="editModalTitle"
      :maskClosable="false"
      @cancel="onModalCancelClick"
    >
      <a-form
        :label-col="{
          span: 7,
        }"
        :wrapper-col="{
          span: 14,
        }"
      >
        <a-form-item label="No" v-bind="validateInfos['form.rawNo']">
          <a-input v-model:value="modelRef.form.rawNo" />
        </a-form-item>
        <a-form-item label="Adı" v-bind="validateInfos['form.name']">
          <a-input v-model:value="modelRef.form.name" />
        </a-form-item>
        <a-form-item label="Kısa Adı" v-bind="validateInfos['form.shortName']">
          <a-input v-model:value="modelRef.form.shortName" />
        </a-form-item>
        <a-form-item label="SAP Kodu" v-bind="validateInfos['form.sapCode']">
          <a-input v-model:value="modelRef.form.sapCode" />
        </a-form-item>
        <a-form-item label="Yoğunluk" v-bind="validateInfos['form.density']">
          <a-input-number
            v-model:value="modelRef.form.density"
            :min="0"
            :max="5000"
          />
        </a-form-item>
        <a-form-item label="Açıklama">
          <a-input v-model:value="modelRef.form.explanation" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button key="back" @click="onModalCancelClick" :disabled="loading"
          >İptal</a-button
        >
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click.prevent="onModalSaveClick"
          >Kaydet</a-button
        >
      </template>
    </a-modal>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref, toRaw, watch } from "vue";
import {
  Table,
  Button,
  Input,
  Popconfirm,
  Modal,
  Tooltip,
  Form,
  notification as showNotify,
  InputNumber,
} from "ant-design-vue";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons-vue";
import { useForm } from "@ant-design-vue/use";
import { useState, useActions, useMutations } from "@/store/hooks";
export default defineComponent({
  name: "RawMaterials",
  components: {
    "a-table": Table,
    "a-button": Button,
    "a-input": Input,
    "a-input-number": InputNumber,
    "a-popconfirm": Popconfirm,
    "a-modal": Modal,
    "a-tooltip": Tooltip,
    "a-form": Form,
    "a-form-item": Form.Item,
    SearchOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
  },
  setup() {
    const searchText = ref("");
    const searchedColumn = ref("");
    const searchInput = ref();
    const editModalTitle = ref("");

    const { items, loading, notification, editMode } = useState(
      ["items", "loading", "notification", "editMode"],
      "rawMaterial"
    );
    const { findAll, save, update, remove } = useActions(
      ["findAll", "save", "update", "remove"],
      "rawMaterial"
    );

    const { setEditMode } = useMutations(["setEditMode"], "rawMaterial");
    const modelRef = reactive({
      form: {
        id: undefined,
        name: "",
        shortName: "",
        sapCode: "",
        rawNo: "",
        explanation: "",
      },
    });

    const rulesRef = reactive({
      "form.name": [{ required: true, message: "Malzeme Adı Alanı Zorunlu." }],
      "form.shortName": [
        { required: true, message: "Malzeme Kısa Adı Alanı Zorunlu." },
      ],
      "form.sapCode": [{ required: true, message: "SAP Kodu Alanı Zorunlu." }],
      "form.rawNo": [
        { required: true, message: "Malzeme Kodu Alanı Zorunlu." },
      ],
    });

    const { validate, validateInfos, resetFields } = useForm(
      modelRef,
      rulesRef
    );

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
        width: 85,
        key: "operations",
        slots: { customRender: "operations", title: "newButton" },
      },
      {
        title: "Kodu",
        dataIndex: "rawNo",
        key: "rawNo",
        width: 120,
        ...filterMethods("rawNo"),
      },
      {
        title: "Tam Adı",
        dataIndex: "name",
        key: "name",
        width: 300,
        ...filterMethods("name"),
      },
      {
        title: "Kısa Adı",
        dataIndex: "shortName",
        key: "shortName",
        width: 150,
        ...filterMethods("shortName"),
      },
      {
        title: "SAP Kodu",
        dataIndex: "sapCode",
        key: "sapCode",
        width: 150,
        ...filterMethods("sapCode"),
      },
      {
        title: "Yoğunluk",
        dataIndex: "density",
        key: "density",
        width: 150,
      },
      {
        title: "Açıklama",
        dataIndex: "explanation",
        key: "explanation",
        ellipsis: true,
        ...filterMethods("explanation"),
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
      resetFields();
      editModalTitle.value = "Yeni Ekle";
      setEditMode(true);
    };

    const onEditClick = (item) => {
      modelRef.form = item;
      setEditMode(true);
      editModalTitle.value = "Düzenle";
    };
    const onModalSaveClick = () => {
      validate()
        .then(() => {
          if (modelRef.form.id) {
            update(toRaw(modelRef.form));
          } else {
            save(toRaw(modelRef.form));
          }
        })
        .catch((err) => {
          showNotify["error"]({
            message: "Veri giriş hatası!",
            description: "Lütfen formu kontrol ediniz.",
          });
        });
    };

    const onModalCancelClick = () => {
      setEditMode(false);
    };

    const onDeleteClick = (id) => {
      remove(id);
    };

    watch(notification, (notify) => {
      showNotify[notify.type]({
        message: notify.message,
        description: notify.description,
      });
    });

    onMounted(findAll);

    return {
      items,
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
      editModalTitle,
      loading,
      validate,
      validateInfos,
      modelRef,
      notification,
    };
  },
});
</script>
