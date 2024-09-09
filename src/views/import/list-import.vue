<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { Form } from 'vee-validate'
import Table from '../../components/Table.vue'
import * as importLogService from '@/api/services/ImportLogService'
import ModalImportErrors from '@/components/ModalImportErrors.vue'
import useAuth from '@/composables/useSession'
import Swal from 'sweetalert2'
import { http, httpImport } from '@/api/api'
import IDownload from '@/components/icones/IDownload.vue'
import { toastInjectionKey } from 'vue-toastification'
import { useToast } from 'vue-toastification'
const { token, logout } = useAuth()
const imports = ref<any[]>([])
const loading = ref(false)
const openModal = ref(false)
const modalError = ref(false)
const openModalApproval = ref(false)
const errorsImport = ref<any[]>([])
const toast = useToast()
const activeItem = ref<any>({})
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

const rejectionReason = ref('')

const openModalReject = ref(false)

const paginationApproval = reactive({
  page: 1,
  limit: 10,
  total: 0
})
const columns = ref([
  {
    label: 'Nome do arquivo',
    key: 'fileName',
    custom: true,
  },
  {
    label: 'Tipo',
    key: 'type',
    custom: true
  },
  {
    label: 'Data de envio',
    key: 'createdAt',
    custom: true
  },
  {
    label: 'Última atualização',
    key: 'updatedAt',
    custom: true
  },
  {
    label: 'Status',
    key: 'status',
    custom: true
  },
  {
    label: '',
    key: 'actions',
  },
])

const dataApproval = ref<any[]>([])
const columnsApproval = ref<any[]>([])

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
    const d = await importLogService.getAllById({
      user_id: 1,
      page: pagination.page,
      limit: pagination.limit,
      where: search.value
        ? {
          name: {
            contains: search.value
          }
        }
        : undefined
    })
    pagination.total = d.data.pagination.totalQuantity
    imports.value = d.data.items
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
  if (token.value)
    listItems()
})

const showModal = async (item: any) => {
  let itemError = []
  if (item.message && item.message.includes('['))
    itemError = JSON.parse(item?.message)
  else
    itemError = [item.message]
  errorsImport.value = itemError
  modalError.value = true
}

const showModalDelete = async (item: any) => {

  Swal.fire({
    title: '<strong>Atenção</strong>',
    icon: 'question',
    html: `Deseja realmente deletar a importação?`,
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: `Não`
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        loading.value = true
        await httpImport.post(`/result/delete-imports-by-id?id=${item.id}`)
        listItems()
      } catch (error) {
        loading.value = false
      } finally {
        loading.value = false
      }
    }

  })
}


async function downloadPlanilha(item: any) {
  try {
    let type = item.type === 'RESULT_MANAGER' ? 'result' : item.type
    if (type === 'TRANSACTION')
      type = 'transactions'
    const res = await httpImport.get(`${type.toLowerCase()}/download-original?key=${item.fileName}`, {
      responseType: 'blob',
      headers: { Authorization: `Bearer ${token.value}` }
    })
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;

    link.setAttribute('download', item.fileName);
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.log(error.response)
    if (error.response.data.statusCode === 401) {
      logout()
    } else {
      toast.error(error.response.data.message)
    }
  }
}

const showModalReject = async () => {
  openModalReject.value = true
}

const handleImportRejeitar = async (item: any) => {
  activeItem.value = item
  openModalReject.value = true
}



const handleImport = async (canApprove: boolean, item?: any) => {
  try {
    if(!item && activeItem.value)
      item = activeItem.value
    loading.value = true
     Swal.fire({
    title: '<strong>Atenção</strong>',
    icon: 'question',
    html: `Deseja realmente ${canApprove ? 'aprovar' : 'rejeitar' } o resultado?`,
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: `Não`
  }).then(async (result: any) => {
    if (result.isConfirmed) {
       if (canApprove) {
      await http.put(`/importLog/${item.id}/approve`)
      } else {
        await http.put(`/importLog/${item.id}/reject`, {
          message: rejectionReason.value
        })
      }
      listItems()
    }

  })
  } catch (error) {
    loading.value = false
  } finally {
    openModalReject.value = false
    loading.value = false
    activeItem.value = {}
  }
}


</script>

<template>
  <ModalImportErrors v-if="modalError" @close="modalError = false" :list-error="errorsImport" />
  <div>
    <div v-if="openModalApproval" class="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-8 w-[1200px]">
        <div class="flex justify-between items-center">
          <h3 class="text-2xl font-medium text-gray-700">Aprovação de importação</h3>
          <button @click="openModalApproval = false">
            <span class="cursor-pointer text-gray-700 hover:text-[#4F46E5] transition-all duration-300"
              @click="openModalApproval = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 5.293a1 1 0 0 1 1.414 0L10 8.586l3.293-3.293a1 1 0 1 1 1.414 1.414L11.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L8.586 10 5.293 6.707a1 1 0 0 1 0-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </span>
          </button>
        </div>
        <Table @remove-search="search = ''" :columns="columnsApproval" :rows="dataApproval"
          :total-page="paginationApproval.total" :current-page="paginationApproval.page"
          :items-per-page="paginationApproval.limit" :loading="loading" :canEdit="false" :canDelete="false"
          @change-page="paginationApproval.page = $event" @change-perPage="paginationApproval.limit = $event">
        </Table>
        <div class="flex justify-end mt-10 gap-2">
          <button @click="handleImport(true)" class="cursor-pointer bg-[#568a59] p-2 rounded-md text-white">
            Aprovar
          </button>
          <button @click="openModalReject = true" class="cursor-pointer bg-[#C53030] p-2 rounded-md text-white">
            Rejeitar
          </button>
        </div>
      </div>
    </div>
    <div v-if="openModalReject" class="fixed z-[99] inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Form @submit="handleImport(false)" class="bg-white rounded-lg p-8 w-[1200px]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-medium text-gray-700">Motivo da rejeição</h3>
          <button @click="openModalReject = false">
            <span class="cursor-pointer text-gray-700 hover:text-[#4F46E5] transition-all duration-300"
              @click="openModalReject = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 5.293a1 1 0 0 1 1.414 0L10 8.586l3.293-3.293a1 1 0 1 1 1.414 1.414L11.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L8.586 10 5.293 6.707a1 1 0 0 1 0-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </span>
          </button>
        </div>
        <base-input v-model="rejectionReason" is-slot rules="required">
          <textarea v-model="rejectionReason" class="w-full h-40 border border-gray-300 rounded-md p-2"
            placeholder="Digite o motivo da rejeição"></textarea>
        </base-input>
        <div class="flex justify-end mt-10 gap-2">
          <button type="submit" class="cursor-pointer bg-[#C53030] p-2 rounded-md text-white">
            Rejeitar
          </button>
        </div>

      </Form>

    </div>

    <h3 class="text-3xl font-medium text-gray-700">Importações</h3>
    <Table :filter-default="true" :columns="columns" :rows="imports" :total-page="pagination.total"
      :current-page="pagination.page" :items-per-page="pagination.limit" :loading="loading" :canEdit="false"
      :canDelete="false" @change-page="handleChangePage" @change-perPage="pagination.limit = $event"
      @search="search = $event">
      <template #fileName="{ row }">
        <p class="truncate ">{{ row.fileName.match(/\d+(.*)/)[1] }}</p>
      </template>
      <template #status="{ row }">
        <div v-if="row.status === 'PROCESSING'" class="text-[#655816] text-center bg-[#FCF7DC] rounded-full py-1">
          <span>Processando</span>
        </div>
        <div type="button" v-else-if="row.status === 'PENDING'"
          class="text-[#6998ff] text-center bg-[#EBF8FF] rounded-full py-1 px-3">
          <span>Pendente</span>
        </div>
        <div type="button" v-else-if="row.status === 'DELETED'"
          class="text-[#C53030] text-center bg-[#FEE2E2] rounded-full py-1 px-3">
          <span>Deletado</span>
        </div>
        <div type="button" v-else-if="row.status === 'ERROR'"
          class="text-[#C53030] text-center bg-[#FEE2E2] rounded-full py-1 px-3">
          <span>Falha</span>
        </div>
        <div type="button" v-else-if="row.status === 'REJECTED'"
          class="text-[#C53030] text-center bg-[#FEE2E2] rounded-full py-1 px-3">
          <span>Rejeitado</span>
        </div>
        <div v-else-if="row.status === 'COMPLETED'" class="text-[#2F855A] text-center bg-[#D1FAE5] rounded-full py-1">
          <span>Completo</span>
        </div>
        <div v-else-if="row.status === 'SEND'" class="text-[#3182CE] text-center bg-[#DBEAFE] rounded-full py-1">
          <span>Enviado</span>
        </div>
      </template>
      <template #actions="{ row }">
        <button v-if="row.status === 'PENDING'" @click="handleImport(true, row)"
          class="cursor-pointer text-green-500">Aprovar</button>
        <button v-if="row.status === 'PENDING'" @click="handleImportRejeitar(row)"
          class="cursor-pointer text-red-500">Rejeitar</button>

        <button type="button" @click="downloadPlanilha(row)"
          class="cursor-pointer text-[#4F46E5]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-download">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
            <path d="M7 11l5 5l5 -5" />
            <path d="M12 4l0 12" />
          </svg>
        </button>
        <button v-if="row.status === 'ERROR'" @click="showModal(row)" class="cursor-pointer text-[#4F46E5]">Ver log de
          upload</button>
      </template>

      <template #createdAt="{ row }">

        <span>{{ new Date(row.createdAt).toLocaleDateString('pt-BR') }}</span>
      </template>
      <template #updatedAt="{ row }">
        <span>{{ new Date(row.updatedAt).toLocaleDateString('pt-BR') }}</span>
      </template>
      <template #type="{ row }">
        <div v-if="row.type === 'RESULT' || row.type === 'RESULT_MANAGER'"
          class="text-[#2F855A] text-center bg-[#D1FAE5] rounded-full py-1">
          <span>Resultado</span>
        </div>
        <div v-else-if="row.type === 'USER'" class="text-[#3182CE] text-center bg-[#DBEAFE] rounded-full py-1">
          <span>Usuário</span>
        </div>
        <div v-else-if="row.type === 'COMPANY'" class="text-[#fdbb57] text-center bg-[#ffecce] rounded-full py-1">
          <span>Empresa</span>
        </div>
        <div v-else-if="row.type === 'TRANSACTION'" class="text-[#4fe5ff] text-center bg-[#f0fdff] rounded-full py-1">
          <span>Crédito</span>
        </div>
      </template>

      <template #importDelete="{ row }">
        <button v-if="(row.type === 'RESULT' || row.type === 'PONTOS') && row.status !== 'DELETED'"
          @click="showModalDelete(row)" class="underline text-red-600 hover:text-red-900">
          Excluir</button>
      </template>
    </Table>
    <div v-if="openModal" class="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-8 w-[1200px]">
        <div class="flex justify-between items-center">
          <h3 class="text-2xl font-medium text-gray-700">Log da importação</h3>
          <button @click="openModal = false">
            <span class="cursor-pointer text-gray-700 hover:text-[#4F46E5] transition-all duration-300"
              @click="openModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 5.293a1 1 0 0 1 1.414 0L10 8.586l3.293-3.293a1 1 0 1 1 1.414 1.414L11.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L8.586 10 5.293 6.707a1 1 0 0 1 0-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
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