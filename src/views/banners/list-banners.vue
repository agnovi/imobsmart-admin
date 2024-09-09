<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import Table from '../../components/Table.vue'
import * as BannersService from '@/api/services/BannersService'
import FullSpinner from '@/components/FullSpinner.vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'
import useAuth from '@/composables/useSession'
const { token } = useAuth()
const router = useRouter()
const toast = useToast()
const items = ref<any[]>([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})
const columns = ref([
  {
    label: 'Banner',
    key: 'image',
    custom: true
  },
  {
    label: 'Link',
    key: 'link'
  },

  {
    label: 'Tela',
    key: 'screenName'
  },
  {
    label: '',
    key: 'actions'
  }
])

onMounted(() => {
  if (token.value) {
    listItems()
  }
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
    const d = await BannersService.list(
      pagination.page,
      pagination.limit,
      search.value
        ? {
          link: {
            contains: search.value
          }
        }
        : undefined
    )
    pagination.total = d.data.pagination.totalQuantity
    items.value = d.data.items

    items.value.map((x) => {
      x.screenName = x.screen.name
    })
  } catch (error) {
    loading.value = false
  } finally {
    loading.value = false
  }
}

function navigation() {
  router.push('/adicionar-banner')
}

async function deleteCategoria(item: any) {
  Swal.fire({
    title: '<strong>Atenção</strong>',
    icon: 'question',
    html: `Deseja realmente deletar este banner`,
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: `Não`
  }).then(async (result: any) => {
    if (result.isConfirmed) {
      await BannersService.deleteBanner(item.id)
      toast.success('Banner removido com sucesso')
      listItems()
    }
  })
}

async function editCategoria(item: any) {
  const res = await BannersService.get(item.id)
  router.push(`/editar-banner/${res.data.id}`)
}
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Banners</h3>
    <Table @remove-search="search = ''" @change-perPage="pagination.limit = $event" :filter-default="true"
      :columns="columns" :rows="items" :loading="loading" :total-page="pagination.total" :current-page="pagination.page"
      :items-per-page="pagination.limit" @edit-item="editCategoria" @delete-item="deleteCategoria"
      @search="search = $event">
      <template #image="{ row }">
        <img :src="row.image" class="h-28" />
      </template>
      <template #BtnTable>
        <div class="flex justify-end">
          <button class="btn-primary mx-2 whitespace-nowrap" @click="navigation">Adicionar banner</button>
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
