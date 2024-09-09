<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import Table from '../../components/Table.vue'
import * as RoleServices from '@/api/services/RoleServices'
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
    justifyEnd: true,
    key: 'actions'
  }
])

onMounted(() => {
  if (token.value)
    listItems()
}
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
    const d = await RoleServices.list(
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
  router.push('/adicionar-cargo')
}

async function deleteCategoria(item: any) {
  Swal.fire({
    title: '<strong>Atenção</strong>',
    icon: 'question',
    html: `Deseja realmente deletar o cargo ${item.name}`,
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: `Não`
  }).then(async (result: any) => {
    if (result.isConfirmed) {
      await RoleServices.handleDelete(item.id)
      toast.success('Cargo removido com sucesso')
      listItems()
    }
  })
}

async function editCategoria(item: any) {
  const res = await RoleServices.get(item.id)
  router.push(`/editar-cargo/${res.data.id}`)
}

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
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Cargos</h3>
    <Table @change-per-page="pagination.limit = $event" :filter-default="true" :columns="columns" :rows="company"
      :total-page="pagination.total" :current-page="pagination.page" :items-per-page="pagination.limit"
      :loading="loading" @edit-item="editCategoria" @delete-item="deleteCategoria"
      @change-page="pagination.page = $event" @search="search = $event">
      <template #BtnTable>
        <div class="flex justify-end">
          <button class="btn-primary mx-2 whitespace-nowrap justify-end" @click="navigation">Adicionar cargo</button>
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
