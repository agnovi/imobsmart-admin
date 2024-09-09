<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import Table from '../../components/Table.vue'
import * as SectorServices from '@/api/services/SectorServices'
import FullSpinner from '@/components/FullSpinner.vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { formatCNPJ } from '@/util/helpers'
import Swal from 'sweetalert2'
import useAuth from '@/composables/useSession'
const { token } = useAuth()
const router = useRouter()
const toast = useToast()
const company = ref<any[]>([])
const loading = ref(false)
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
    label: '',
    key: 'actions'
  }
])

onMounted(() => {
  if (token.value)
    listTables()
})
const search = ref<string>('')
watch(
  () => search.value,
  () => {
    if (search.value.length >= 3) listTables()

    if (!search.value) listTables()
  }
)

async function listTables() {
  loading.value = true
  try {
    const d = await SectorServices.list(
      pagination.page,
      pagination.limit,
      search.value
        ? {
          name: {
            contains: search.value
          }
        }
        : undefined
    )
    const newArray = d.data.items.map((i: any) => {
      return { ...i, cnpj: formatCNPJ(i.cnpj) }
    })
    pagination.total = d.data.pagination.totalQuantity
    company.value = newArray
  } catch (error) {
    loading.value = false
  } finally {
    loading.value = false
  }
}

function navigation() {
  router.push('/adicionar-setor')
}

async function deleteCategoria(item: any) {
  Swal.fire({
    title: '<strong>Atenção</strong>',
    icon: 'question',
    html: `Deseja realmente deletar o setor ${item.name}`,
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: `Não`
  }).then(async (result: any) => {
    if (result.isConfirmed) {
      await SectorServices.handleDelete(item.id)
      toast.success('Setor removido com sucesso')
      listTables()
    }
  })
}

async function editCategoria(item: any) {
  const res = await SectorServices.get(item.id)
  router.push(`/editar-setor/${res.data.id}`)
}
watch(
  () => pagination.page,
  () => {
    listTables()
  },
  { deep: true }
)
watch(
  () => pagination.limit,
  () => {
    listTables()
  },
  { deep: true }
)
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Setores</h3>
    <Table @change-per-page="pagination.limit = $event" :filter-default="true" :columns="columns" :rows="company"
      :total-page="pagination.total" :current-page="pagination.page" :items-per-page="pagination.limit"
      :loading="loading" @edit-item="editCategoria" @change-page="pagination.page = $event"
      @delete-item="deleteCategoria" @search="search = $event">
      <template #BtnTable>
        <div class="flex justify-end">
          <button class="btn-primary mx-2 whitespace-nowrap	justify-end" @click="navigation">Adicionar setor </button>
        </div>
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
