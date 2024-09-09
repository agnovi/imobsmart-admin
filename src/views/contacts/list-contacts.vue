<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import Table from '../../components/Table.vue'
import * as contactService from '@/api/services/ContactService'
import Modal from '@/components/Modal.vue'
import useAuth from '@/composables/useSession'
import Swal from 'sweetalert2'
import { http, httpImport } from '@/api/api'
const { token } = useAuth()
const contacts = ref<any[]>([])
const loading = ref(false)
const openModal = ref(false)
const modal = ref(false)
const dados = ref<any>({});
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})
const columns = ref([
  {
    label: 'Nome',
    key: 'name'
  },
  {
    label: 'E-mail',
    key: 'email',
  },
  {
    label: 'Mensagem',
    key: 'message',
    custom: true
  },
  {
    label: 'Data',
    key: 'data',
    custom: true
  },
  {
    label: '',
    key: 'actions',
  },

])

watch(
  () => pagination.page,
  () => {
    listItems()
  },
  { deep: true }
)
watch(
  () => pagination.limit,
  () => {
    listItems()
  },
  { deep: true }
)
const search = ref<string>('')
watch(
  () => search.value,
  () => {
    if (search.value.length >= 3) listItems()

    if (!search.value) listItems()
  }
)
async function listItems() {
  loading.value = true
  try {
    const d = await contactService.listContact(
      pagination.page,
      pagination.limit
    )
    pagination.total = d.data.pagination.totalQuantity
    const newArray = d.data.items.map((m: any) => {
      const dataHora: Date = new Date(m.createdAt);
      const dia: number = dataHora.getUTCDate();
      const mes: number = dataHora.getUTCMonth() + 1;
      const ano: number = dataHora.getUTCFullYear()
      return {
        id: m.id,
        name: m.user.name,
        email: m.user.email,
        message: m.message,
        data: `${dia}/${mes}/${ano}`
      }
    })
    contacts.value = newArray
  } catch (error) {
    loading.value = false
  } finally {
    loading.value = false
  }
}

function handleChangePage(page: number) {
  pagination.page = page
}

onMounted(() => {
  if (token.value) listItems()
})

const showModal = async (item: any) => {

  dados.value = item
  modal.value = true
}
</script>

<template>

  <Modal @close="modal = true" title="Mensagem" v-model="modal">
    <template #body>
      <div>
        <p v-if="dados.message">{{ dados.message }}</p>
      </div>

    </template>

  </Modal>

  <div>
    <h3 class="text-3xl font-medium text-gray-700">Contatos</h3>
    <Table @remove-search="search = ''" :filter-default="true" :columns="columns" :rows="contacts"
      :total-page="pagination.total" :current-page="pagination.page" :items-per-page="pagination.limit"
      :loading="loading" :canEdit="false" :canDelete="false" @change-page="handleChangePage"
      @change-perPage="pagination.limit = $event">
      <template #name="{ row }">
        <div>
          <p>{{ row.user.name }}</p>
        </div>
      </template>
      <template #message="{ row }">
        <div>
          <p class="truncate w-[250px]">{{ row.message }}</p>
        </div>
      </template>
      <template #data="{ row }">
        <div>
          <p class="truncate ">{{ row.data }}</p>
        </div>
      </template>
      <template #actions="{ row }">
        <button class="cursor-pointer text-[#4F46E5]" @click="showModal(row)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-eye">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
            <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
          </svg></button>
      </template>
    </Table>

  </div>
</template>

<style scoped>
.btn-primary {
  background-color: #4f46e5;
  color: #ffffff;
  font-size: 14px;
  padding: 8px;
  gap: 10px;
  width: Hug (156px);
  height: Hug (36px);
  border-radius: 6px;
}

.btn-saved {
  background-color: #4f46e5;
  color: #ffffff;
  font-size: 14px;
  padding: 16px 50px 16px 50px;
  gap: 10px;
  width: Hug (156px);
  height: Hug (36px);
  border-radius: 6px;
}

.btn-primary:hover {
  background-color: #3630a8;
}

.btn-import {
  background-color: #f9fafb;
  color: #354052;
  font-size: 14px;
  padding: 8px;
  gap: 10px;
  width: Hug (156px);
  height: Hug (36px);
  border-radius: 6px;
}

.btn-import:hover {
  background-color: #cfcfcf;
}
</style>
