<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import Table from '../../components/Table.vue'
import * as PropertyServices from '@/api/services/PropertyService'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Iimport from '@/components/icones/Iimport.vue'
import { formatCNPJ } from '@/util/helpers'
import useAuth from '@/composables/useSession'
import { IProperty } from '@/types/property'
import Swal from 'sweetalert2'
const { token } = useAuth()
const router = useRouter()
const toast = useToast()
const items = ref<IProperty[]>([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})
const columns = ref([
  {
    label: 'Código',
    key: 'cod_unique'
  },
  {
    label: 'Imóvel',
    key: 'title'
  },
  {
    label: 'Endereço',
    key: 'address'
  },
  {
    label: 'Bairro',
    key: 'neighborhoods'
  },
  {
    label: 'Cidade',
    key: 'citys'
  },
  {
    label: '',
    key: 'actions'
  }
])

onMounted(() => {
  if (token.value)
    listItems()
})
const search = ref<string>('')
watch(
  () => search.value,
  () => {
    if (search.value.length >= 3) listItems()

    if (!search.value) listItems()
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
    const res = await PropertyServices.list(
      pagination.page,
      pagination.limit,
      search.value
    )
    const newArray = res.data?.rows?.map((i: any) => {
      return { ...i, cnpj: formatCNPJ(i.cnpj) }
    })
    pagination.total = res.data.pagination.totalQuantity
    items.value = newArray
  } catch (error) {
    loading.value = false
  } finally {
    loading.value = false
  }
}

function handleAddProperty() {
  router.push('/adicionar-imovel')
}

async function deleteItem(item: any) {
  Swal.fire({
    title: '<strong>Atenção</strong>',
    icon: 'question',
    html: `Deseja realmente deletar o imóvel ${item.title}?`,
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: `Não`
  }).then((result: any) => {
    if (result.isConfirmed) {
      PropertyServices.deleteItem(item.id).then((f: any) => {
        listItems()
        toast.success('Imóvel excluido com sucesso!')
      })
    }
  })
}

async function editItem(item: any) {
  router.push(`/editar-imovel/${item.id_property}`)
}
function handleSearch(event: any) {
  search.value = event
  console.log(search.value)
}
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Imóveis</h3>
    <Table @remove-search="search = ''" @change-perPage="pagination.limit = $event" :filter-default="true"
      :columns="columns" :rows="items" :total-page="pagination.total" :current-page="pagination.page"
      :items-per-page="pagination.limit" :loading="loading" @edit-item="editItem"
      @change-page="pagination.page = $event" @delete-item="deleteItem" @search="handleSearch($event)">
      <template #rede="{ row }">
        <p>{{ row.NetworkCompany?.name }}</p>
      </template>
      <template #BtnTable>
        <div class="flex justify-end">
          <button class="btn-import mx-2 whitespace-nowrap" @click="router.push('/importar-imoveis')">
            <div class="flex">
              <span> Importar imóveis </span>
              <span class="mx-2 mt-1">
                <Iimport />
              </span>
            </div>
          </button>
          <button class="btn-primary mx-2" @click="handleAddProperty">Adicionar imóvel</button>
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
