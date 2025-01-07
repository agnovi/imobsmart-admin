<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Pagination from './Pagination.vue'
import Iimport from './icones/Iimport.vue'
import IDownload from './icones/IDownload.vue'


export interface ISelect {
  name?: string;
  value?: number | string
}

interface Props {
  columns: any[]
  rows: any[]
  totalPage?: number
  itemsPerPage?: number
  searchProps?: string
  filterDefault?: boolean
  currentPage?: number
  canEdit?: boolean
  canImport?: boolean
  canExport?: boolean
  canDelete?: boolean
  rowSelected?: boolean
  loading?: boolean
  canPaginate?: boolean
  canExtrairMetas?: boolean
  roles?: ISelect[]
  filterPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: true,
  canDelete: true,
  canImport: false,
  canExport: false,
  canPaginate: true,
  rowSelected: false,
  roles: () => [],
  columns: () => [],
  rows: () => []
})
const search = ref(props.searchProps)
const perPage = ref(10)
const selectedRole = ref<any>('')

const emits = defineEmits([
  'editItem',
  'deleteItem',
  'itemSort',
  'changePerPage',
  'update:currentPage',
  'changePage',
  'importItem',
  'extrairMetas',
  'search',
  'selectedRole',
  'exportItem',
  'removeSearch',
])

const currentPage = computed({
  get() {
    return props.currentPage
  },
  set: (value) => {
    emits('update:currentPage', value)
  }
})

// METHODS
function changePage(p: any) {
  emits('changePage', p)
}
function changePerPageFilter() {
  emits('changePerPage', perPage.value)
}
function editItem(item: any) {
  emits('editItem', item)
}
function importItem(item: any) {
  emits('importItem', item)
}
function extrairMetas(item: any) {
  emits('extrairMetas', item)
}
function exportItem(item: any) {
  emits('exportItem', item)
}
function deleteItem(item: any) {
  emits('deleteItem', item)
}
function itemSort(name: string, sort: 'asc' | 'desc') {
  if (name === 'actions') return
  emits('itemSort', { name, sort })
}
function handleSearch() {
  emits('search', search.value)
}
function handleRole() {
  emits('selectedRole', selectedRole.value)
}

function removeSearch() {
  search.value = ''
  emits('removeSearch')
}
watch(
  () => props.searchProps,
  () => {
    search.value = props.searchProps
  }
)
</script>
<style scoped>
.rowInactive {
  background-color: #ffe2e2;
}
</style>
<template>
  <div class="flex flex-col mt-6">
    <div class="flex flex-col sm:flex-row gap-2 justify-between items-center flex-row mb-5" v-if="props.filterDefault">
      <div class="flex w-full">
        <div class="relative w-[77px]">
          <select v-model="perPage" @change="changePerPageFilter"
            class="block w-[77px] h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border border-gray-400 rounded-l appearance-none focus:outline-none focus:bg-white focus:border-gray-500">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>

        <div
          class="sm:mt-0 px-2 flex-1 flex justify-between items-center w-full  text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded-l rounded-r ">

          <div>
            <svg viewBox="0 0 24 24" class="w-[20px] h-[20px] text-gray-500 fill-current">
              <path
                d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z" />
            </svg>
          </div>
          <input v-model="search" @input="handleSearch"
            :placeholder="filterPlaceholder ? filterPlaceholder : 'Pesquisar'"
            class="w-full  sm:rounded-l-none focus:bg-white border-none  focus:outline-none focus:ring-0 focus:border-transparent " />
          <svg @click="removeSearch" v-if="search && search?.length > 0" xmlns="http://www.w3.org/2000/svg"
            class="-ml-1 mr-3 h-7 w-7 cursor-pointer text-gray-400 hover:text-gray-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>



        </div>
        <div v-if="roles.length > 0" class="relative w-[200px]">
          <select v-model="selectedRole" :class="`${!selectedRole ? 'text-gray-300' : ''}`"
            class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border border-gray-400 rounded-l appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
            @change="handleRole">
            <option value="" disabled selected class="hidden">Cargo</option>
            <option v-for="role in roles" :key="String(role.value)" :value="role.value" class="text-gray-600">{{
        role.name }}</option>
          </select>
        </div>
      </div>

      <div class="order-last relative block sm:mt-0 w-full">
        <slot name="BtnTable"></slot>
      </div>
    </div>

    <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div v-if="loading" class="flex justify-center py-10">
        <div class="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
      </div>
      <div v-else
        class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded">
        <table class="min-w-full">
          <thead>
            <tr>
              <th v-if="rowSelected"
                class="px-6 py-3 text-[12px] text-left text-[#6B7280] uppercase border-b border-gray-200 bg-gray-50">
                <slot name="headTemplateCheck" />
              </th>
              <th v-for="(column, index) in columns" :key="index"
                class="px-6 py-3 text-[12px] text-left text-[#6B7280] uppercase border-b border-gray-200 bg-gray-50"
                :class="{
      'justify-end': column.justifyEnd
    }" @click="itemSort(column.key, column.sort)">
                {{ column.label }}
                <span v-if="column.sort && column.key !== 'actions'" class="ml-1">
                  <i :class="column.sort === 'asc' ? 'fa fa-caret-up' : 'fa fa-caret-down'" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr v-for="(row, rowIndex) in rows" :key="rowIndex" :class="{ rowInactive: !!row.deletedAt }">
              <td v-if="rowSelected"
                class="px-6 py-4 border-b border-gray-200 whitespace-nowrap text-[#6B7280] text-[14px]">
                <slot name="templteCheckbox" :data="row" />
              </td>

              <td v-for="(column, colIndex) in columns" :key="colIndex"
                class="px-6 py-4 border-b border-gray-200 whitespace-nowrap text-[#6B7280] text-[14px]"
                :class="{ 'bg-[#FFE7E7]': row['error'] && !row[column.key] && column.required }">
                <span v-if="!column.custom"> {{ row[column.key] }}</span>
                <template v-else>
                  <slot :name="column.key" :row="row" />
                </template>

                <div v-if="column.key === 'actions'">
                  
                  <div class="flex flex-row items-center justify-end gap-3">

                    <VTooltip v-if="canExport" class="mt-[0.3rem]">
                      <button type="button" class="cursor-pointer text-[#4F46E5]" @click="exportItem(row)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                          stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="icon icon-tabler icons-tabler-outline icon-tabler-download">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                          <path d="M7 11l5 5l5 -5" />
                          <path d="M12 4l0 12" />
                        </svg>
                      </button>
                      <template #popper> Exportar usuário </template>



                    </VTooltip>

                    <VTooltip v-if="canExtrairMetas && !row.deletedAt" class="mt-[0.3rem]">
                      <button type="button" @click="extrairMetas(row)">
                        <IDownload :width="20" :height="20" />
                      </button>
                      <template #popper> Extrair dados de metas </template>
                    </VTooltip>
                   
                    <VTooltip v-if="canImport && !row.deletedAt" class="mt-[0.3rem]">
                      <button type="button" @click="importItem(row)">
                        <Iimport :width="20" :height="20" />
                      </button>
                      <template #popper> Importar resultados </template>
                    </VTooltip>

                    <button v-if="canEdit" type="button" @click.prevent="editItem(row)"
                      class="underline text-indigo-600 hover:text-indigo-900">
                      Editar
                    </button>
                    <button v-if="canDelete && !row.deletedAt" type="button" @click="deleteItem(row)"
                      class="underline text-red-600 hover:text-red-900">
                      Excluir
                      <!-- <ITrash color="#FF0000" /> -->
                    </button>

                    <slot name="actions" :row="row" />

                    <slot name="importDelete" :row="row" />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination  v-if="canPaginate" :totalItems="props.totalPage" :currentPage="props.currentPage"
          @pageChange="(p: any) => changePage(p)" :itemsPerPage="props.itemsPerPage" />
      </div>
    </div>
  </div>
</template>
