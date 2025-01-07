<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import Table from '@/components/Table.vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { formatCPF } from '@/util/helpers'
import { listUser, deleteUser } from '@/api/services/User'
import { http } from '@/api/api'
import { useDebounceFn } from '@vueuse/core'
import useAuth from '@/composables/useSession'
import { User } from '@/api/model/UserModel'
import FullSpinner from '@/components/FullSpinner.vue'
const { token } = useAuth()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const loadingDelete = ref(false)
const users = ref<User[]>()

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
    key: 'email'
  },
  {
    label: 'CPF',
    key: 'document',
    custom: true
  },
  {
    label: 'Tipo',
    key: 'type',
    custom: true
  },
  {
    label: 'Plano',
    key: 'plan',
    custom: true
  },
  {
    label: 'Status',
    key: 'status',
    custom: true
  },
  {
    label: '',
    key: 'actions'
  }
])

onMounted(() => {
  if (token.value) {
    loading.value = true
    const query = router.currentRoute.value.query
    pagination.page = query.page ? Number(query.page) : 1
    pagination.limit = query.limit ? Number(query.limit) : 10
    search.value = query.search ? String(query.search) : ''

    router.replace({ path: router.currentRoute.value.path, query: {} })
    listItems()
  }
})
const search = ref<string>('')
watch(
  () => search.value,
  () => {
    if(loading.value) return
    pagination.page = 1
    if (search.value.length >= 3) debouncedFn()

    if (!search.value) debouncedFn()
  }
)
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

async function listItems() {
  loading.value = true
  try {
    const res = await listUser(pagination.page, pagination.limit, search.value)
    console.log('clientes', res)
    pagination.total = res.data.pagination.totalQuantity
    users.value = res.data?.rows
  } catch (error) {
    loading.value = false
  } finally {
    loading.value = false
  }
}

const debouncedFn = useDebounceFn(
  () => {
    listItems()
  },
  1000,
  { maxWait: 5000 }
)

function handleAdd() {
  router.push('/adicionar-usuario')
}

async function handleEditedit(item: any) {
  router.push({
    path: `/editar-usuario/${item.id_client}`,
    query: {
      page: String(pagination.page),
      limit: String(pagination.limit),
      search: search.value || ''
    }
  })
}

// async function exportItem() {
//   try {
//     const res = await httpImport.get(`user/export-details`, {
//       responseType: 'blob',
//       headers: { Authorization: `Bearer ${token.value}` }
//     })
//     const url = window.URL.createObjectURL(new Blob([res.data]))
//     const link = document.createElement('a')
//     link.href = url
//     link.setAttribute('download', 'usuarios.xlsx')
//     document.body.appendChild(link)
//     link.click()
//     window.URL.revokeObjectURL(url)
//   } catch (error: any) {
//     console.log(error)
//   }
// }

async function removeUser(item: any) {
  Swal.fire({
    title: '<strong>Atenção</strong>',
    icon: 'question',
    html: `Deseja realmente deletar o usuário ${item.name}`,
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: `Não`
  }).then((result: any) => {
    if (result.isConfirmed) {
      loadingDelete.value = true
      deleteUser(item.id_client)
        .then(() => {
          listItems()
          toast.success('Cliente excluido com sucesso!')
        })
        .finally(() => {
          loadingDelete.value = false
        })
    }
  })
}

async function handleSendAccess(item: User) {
  try {
    const res = await http.patch(`users/log-in/${item.id_client}`)

    toast.success(`E-mail de acesso enviado para ${item.name}`)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div>
    <FullSpinner v-if="loadingDelete" />
    <h3 class="text-3xl font-medium text-gray-700">Clientes</h3>
    <Table
      :loading="loading"
      :columns="columns"
      :rows="users"
      :total-page="pagination.total"
      :current-page="pagination.page"
      :items-per-page="pagination.limit"
      :filter-default="true"
      :searchProps="search"
      @edit-item="handleEditedit"
      @delete-item="removeUser"
      @remove-search="search = ''"
      @changePerPage="pagination.limit = $event"
      @changePage="pagination.page = $event"
      @search="search = $event"
    >
      <template #BtnTable>
        <div class="flex justify-end">
          <!-- <button type="button" class="btn-import mss-2 mr-2 whitespace-nowrap" @click="exportItem">
            <div class="flex gap-1 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#354052" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-download">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                <path d="M7 11l5 5l5 -5" />
                <path d="M12 4l0 12" />
              </svg>
              <span> Exportar usuários </span>
            </div>
          </button>
          <button class="btn-import mss-2 whitespace-nowrap" @click="router.push('importar-usuarios')">
            <div class="flex">
              <span class="mx-2 mt-1">
                <IImport />
              </span>
              <span> Importar usuários </span>
            </div>
          </button> -->
          <button class="btn-primary mx-2" @click="handleAdd">Adicionar usuários</button>
        </div>
      </template>
      <template #document="{ row }">
        <p>{{ formatCPF(row.document) }}</p>
      </template>
      <template #type="{ row }">
        <p>{{ row.type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica' }}</p>
      </template>
      <template #plan="{ row }">
        <p>{{ row?.plan_active?.plans?.name }}</p>
        <div
          v-if="row?.plan_active?.status === 'RECEIVED'"
          class="text-[#10B981] text-center bg-[#D1FAE5] rounded-full py-1"
        >
          <span>Pago</span>
        </div>
        <!-- <div v-else-if="row?.plan_active?.status === 'INATIVO'" class="text-[#C53030] text-center bg-[#FEE2E2] rounded-full py-1">
          <span>Inativo</span>
        </div> -->
        <div
          v-else-if="row?.plan_active?.status === 'PROCESSING'"
          class="text-[#F59E0B] text-center bg-[#FEF3C7] rounded-full py-1"
        >
          <span>Processando</span>
        </div>
        <div
          v-else-if="row?.plan_active?.status === 'TRIAL'"
          class="text-[#6B7280] text-center bg-[#E5E7EB] rounded-full py-1"
        >
          <span>Trial</span>
        </div>
      </template>
      <template #status="{ row }">
        <div
          v-if="row.status === 'ATIVO'"
          class="text-[#10B981] text-center bg-[#D1FAE5] rounded-full py-1"
        >
          <span>Ativo</span>
        </div>
        <!-- <div v-else-if="row.status === 'PENDING'" class="text-[#F59E0B] text-center bg-[#FEF3C7] rounded-full py-1">
          <span>Pendente</span>
        </div> -->
        <div
          v-else-if="row.status === 'INATIVO'"
          class="text-[#C53030] text-center bg-[#FEE2E2] rounded-full py-1"
        >
          <span>Inativo</span>
        </div>
        <!-- <div v-else-if="row.status === 'DELETED'" class="text-[#6B7280] text-center bg-[#E5E7EB] rounded-full py-1">
          <span>Deletado</span>
        </div> -->
        <!-- <div v-else-if="row.status === 'BLOCKED'" class="text-[#EF4444] text-center bg-[#FED7D7] rounded-full py-1">
          <span>Bloqueado</span>
        </div>
        <div v-else-if="row.status === 'PRE_REGISTER'"
          class="text-[#F59E0B] text-center bg-[#FEF3C7] rounded-full py-1">
          <span>Pré-registrado</span>
        </div> -->
      </template>

      <template #actions="{ row }">
        <button
          v-if="row.first_login"
          type="button"
          class="underline text-green-600 hover:text-green-900"
          @click="handleSendAccess(row)"
        >
          Enviar acesso
        </button>
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
