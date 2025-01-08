<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import Table from '../../components/Table.vue'
import Badge from '../../components/Badge.vue'
import Pdf from '../../components/icones/Pdf.vue'
import PropertyFilterModal from '../../components/FilterModal.vue'
import Filter from '../../components/icones/Filter.vue'
import * as PropertyServices from '@/api/services/PropertyService'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { formatCNPJ } from '@/util/helpers'
import useAuth from '@/composables/useSession'
import { IProperty } from '@/types/property'
import Swal from 'sweetalert2'
import { useDebounceFn } from '@vueuse/core'
import { formatToBRL } from '@/util/helpers'
const { token } = useAuth()
const router = useRouter()
const toast = useToast()
const modalOpen = ref(false);
const items = ref<IProperty[]>([])
const loading = ref(false)
const filters = ref<any>({});

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})
const columns = ref([
  {
    label: 'ID',
    key: 'id_property'
  },
  {
    label: 'Imóvel',
    key: 'title'
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
    label: 'Valor',
    key: 'sale_value',
    custom: true
  },
  {
    label: 'Dormitórios',
    key: 'dormitory_number'
  },
  {
    label: 'Suites',
    key: 'suites'
  },
  {
    label: 'Vagas',
    key: 'vacancies'
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
    if (search.value.length >= 1) debouncedFn()

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

watch(
    () => filters.value,
    () => {
        listItems();
    },
    { deep: true }
);

async function listItems() {
  loading.value = true
  try {
    const filtersJson = localStorage.getItem('filters');
    const filtersObject = filtersJson ? JSON.parse(filtersJson) : null;
    const res = await PropertyServices.list({ search: search.value, page: pagination.page, limit: pagination.limit,  ...filtersObject })
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

const debouncedFn = useDebounceFn(
  () => {
    listItems()
  },
  1000,
  { maxWait: 5000 }
)

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
  router.push({
    path: `/editar-imovel/${item.id_property}`,
    query: {
      page: String(pagination.page),
      limit: String(pagination.limit),
      search: search.value || ''
    }
  })
}
function handleSearch(event: any) {
  search.value = event
  console.log(search.value)
}

function handleFilter(filter: any) {
    pagination.page = 1
    search.value = ''

    localStorage.setItem('filters', JSON.stringify(filter))
    filters.value = JSON.parse(JSON.stringify(filter));
}
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Imóveis</h3>
    <Table
      :filter-default="true"
      :columns="columns"
      :rows="items"
      :total-page="pagination.total"
      :current-page="pagination.page"
      :items-per-page="pagination.limit"
      :searchProps="search"
      :loading="loading"
      @remove-search="search = ''"
      @change-perPage="pagination.limit = $event"
      @edit-item="editItem"
      @change-page="pagination.page = $event"
      @delete-item="deleteItem"
      @search="handleSearch($event)"
    >
      <template #status="{ row }">
        <Badge v-if="row.status" :text="row.status" />
      </template>
      <template #sale_value="{ row }">
        <span> {{ formatToBRL(row.sale_value) }} </span>
      </template>
      <template #actions="{ row}">
        <a v-if="row.link_table" v-tooltip="'Tabela'" :href="row.link_table" target="_black">
        <Pdf />
        </a>
      </template>
      <template #BtnTable>
        <div class="flex justify-end">
           <button borderColor="border-[#F9FAFB]" bgColor="bg-[#F9FAFB]" class="flex items-center border border-gray-300 rounded-[6px] gap-2 text-sm px-2 mx-2"
              @click="modalOpen = true">
            <Filter /> <span class="text-[#353535] hidden md:block">Filtro avançado</span>
          </button>
          <!-- <button class="btn-import mx-2 whitespace-nowrap" @click="router.push('/importar-imoveis')">
            <div class="flex">
              <span> Importar imóveis </span>
              <span class="mx-2 mt-1">
                <Iimport />
              </span>
            </div>
          </button> -->
          <button class="btn-primary mx-2" @click="handleAddProperty">Adicionar imóvel</button>
        </div>
      </template>
    </Table>
  </div>
  <PropertyFilterModal :isOpen="modalOpen" @close="modalOpen = false" @filter="handleFilter($event)" />
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
