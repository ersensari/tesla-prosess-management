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
      :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :bordered="true"
    >
      <template #newButton>
        <div style="margin-left: 16px">
          <a-tooltip placement="topLeft">
            <template #title>
              <span>Yeni Kullanıcı Ekle</span>
            </template>
            <a-button type="primary" shape="circle" size="small" @click="onNewClick()">
              <template #icon><PlusCircleOutlined /></template>
            </a-button>
          </a-tooltip>
        </div>
      </template>
      <template #operations="{ record }">
        <div style="display: flex; gap: 0.5rem" v-if="record.username !== 'admin'">
          <a-popconfirm v-if="items.length" title="Silmek istediğinizden emin misiniz?" @confirm="onDeleteClick(record.id)">
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
    </a-table>

    <a-modal v-model:visible="editMode" :title="editModalTitle" :maskClosable="false" @cancel="onModalCancelClick">
      <a-form
        :label-col="{
          span: 7,
        }"
        :wrapper-col="{
          span: 14,
        }"
      >
        <a-form-item label="Kullanıcı Adı" v-bind="validateInfos['form.username']">
          <a-input v-model:value="modelRef.form.username" />
        </a-form-item>
        <a-form-item label="Şifre" v-bind="validateInfos['form.password']">
          <a-input-password v-model:value="modelRef.form.password" />
        </a-form-item>
        <a-form-item label="Adı" v-bind="validateInfos['form.firstName']">
          <a-input v-model:value="modelRef.form.firstName" />
        </a-form-item>
        <a-form-item label="Soyadı" v-bind="validateInfos['form.lastName']">
          <a-input v-model:value="modelRef.form.lastName" />
        </a-form-item>
        <a-form-item label="Kullanıcı Grubu" v-bind="validateInfos['form.role']">
          <a-select v-model:value="modelRef.form.role" placeholder="Lütfen kullanıcı grubu seçiniz">
            <a-select-option value="admin">Yönetici</a-select-option>
            <a-select-option value="operator">Operatör</a-select-option>
            <a-select-option value="kalitekontrol">Kalite Kontrol</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button key="back" @click="onModalCancelClick" :disabled="loading">İptal</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click.prevent="onModalSaveClick">Kaydet</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref, toRaw, watch } from 'vue';
import { Table, Select, Button, Input, Popconfirm, Modal, Tooltip, Form, notification as showNotify, InputNumber } from 'ant-design-vue';
import { SearchOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { useForm } from '@ant-design-vue/use';
import { useState, useActions, useMutations } from '@/store/hooks';
export default defineComponent({
  name: 'UserManagement',
  components: {
    'a-table': Table,
    'a-button': Button,
    'a-input': Input,
    'a-input-password': Input.Password,
    'a-input-number': InputNumber,
    'a-popconfirm': Popconfirm,
    'a-modal': Modal,
    'a-tooltip': Tooltip,
    'a-form': Form,
    'a-form-item': Form.Item,
    'a-select': Select,
    'a-select-option': Select.Option,
    SearchOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
  },
  setup() {
    const editModalTitle = ref('');

    const { items, loading, notification, editMode } = useState(['items', 'loading', 'notification', 'editMode'], 'user');
    const { findAll, save, update, remove } = useActions(['findAll', 'save', 'update', 'remove'], 'user');

    const { setEditMode } = useMutations(['setEditMode'], 'user');
    const modelRef = reactive({
      form: {
        id: undefined,
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        role: '',
      },
    });

    const rulesRef = reactive({
      'form.username': [{ required: true, message: 'Kullanıcı Adı Alanı Zorunlu.' }],
      'form.password': [{ required: true, message: 'Şifre Alanı Zorunlu.' }],
      'form.firstName': [{ required: true, message: 'Adı Alanı Zorunlu.' }],
      'form.lastName': [{ required: true, message: 'Soyadı Alanı Zorunlu.' }],
      'form.role': [{ required: true, message: 'Kullanıcı Grubu Alanı Zorunlu.' }],
    });

    const { validate, validateInfos, resetFields } = useForm(modelRef, rulesRef);

    const columns = [
      {
        width: 85,
        key: 'operations',
        slots: { customRender: 'operations', title: 'newButton' },
      },
      {
        title: 'Kullanıcı Adı',
        dataIndex: 'username',
        key: 'username',
        width: 120,
      },
      {
        title: 'Adı',
        dataIndex: 'firstName',
        key: 'firstName',
        width: 200,
      },
      {
        title: 'Soyadı',
        dataIndex: 'lastName',
        key: 'lastName',
        width: 200,
      },
      {
        title: 'Kullanıcı Grubu',
        dataIndex: 'role',
        key: 'role',
        width: 200,
      },
    ];

    const onNewClick = () => {
      resetFields();
      editModalTitle.value = 'Yeni Kullanıcı';
      setEditMode(true);
    };

    const onEditClick = (item) => {
      modelRef.form = item;
      setEditMode(true);
      editModalTitle.value = 'Düzenle';
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
          showNotify['error']({
            message: 'Veri giriş hatası!',
            description: 'Lütfen formu kontrol ediniz.',
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
