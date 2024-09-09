<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import Table from '../components/Table.vue'
import CardForm from '../components/CardForm.vue'
import IImport from '../components/icones/Iimport.vue'
import { useRouter } from 'vue-router'
import { ICredit } from '@/types/credit'
import { useToast } from 'vue-toastification'
import useAuth from '../composables/useSession'
import Swal from 'sweetalert2'
import { listCredit, getCredit, createCredit, deleteCredit, updateCredit, getBalance } from '@/api/services/CreditsService'
import { listUser, listUserWithoutPagination } from '@/api/services/User'
import { listPartners } from '@/api/services/PartnersService'
import IChange from '@/components/icones/IChange.vue'

const { token } = useAuth()

const toast = useToast()
const router = useRouter()
const loading = ref(false)
const userOptions = ref<any[]>([])
const canLoadMore = ref(true)
const load = ref(null)
const searchUser = ref<string>('')
const observer = ref<any>(null)
const limit = ref(20)
const loadingSave = ref(false)
const loadingBalance = ref(false)
const credits = ref<ICredit[]>()
const credit = ref<ICredit>({})
const partnersOptions = ref<any[]>([])
const balance = ref<number>(0)
const selectedRole = ref<any>()
const search = ref<string>('')
const modalOpen = ref<boolean>(false)
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})
const columns = ref([
  {
    label: 'ID',
    key: 'id'
  },
  {
    label: 'Usuário',
    key: 'userNome'
  },
  {
    label: 'CPF',
    key: 'userCpf'
  },
  {
    label: 'Valor',
    key: 'value',
  },
  {
    label: 'Data',
    key: 'createdAt',
    custom: true
  },
  {
    label: '',
    key: 'actions'
  }
])

const filtered = computed(() => {
  return userOptions.value?.filter((item: any) => {
    return item.text.toLowerCase().includes(search.value.toLowerCase())
  })
})

const paginated = computed(() => {
  return filtered.value?.slice(0, limit.value)
})

const hasNextPage = computed(() => {
  return canLoadMore.value
})

async function onOpen() {
  if (hasNextPage.value) {
    await nextTick()
    observer.value.observe(load.value)
  }
}

function onClose() {
  observer.value.disconnect()
}

async function loadMoreUsers() {
  await listUser(1, limit.value, null, undefined, searchUser.value).then(({ data }: any) => {
    if (data.items.length < limit.value) {
      canLoadMore.value = false
    }
    userOptions.value = data.items.map((item: any) => ({
      id: item.id,
      text: item.name,
      label: `${item.name} - ${item.cpf}`
    }))
  });
}



async function infiniteScroll([{ isIntersecting, target }]: any) {
  if (isIntersecting) {
    const ul = target.offsetParent
    const scrollTop = target.offsetParent?.scrollTop
    await loadMoreUsers();
    limit.value += 20
    await nextTick()
    ul.scrollTop = scrollTop
  }
}

async function removeUser(item: any) {
  Swal.fire({
    title: '<strong>Atenção</strong>',
    icon: 'question',
    html: `Deseja realmente deletar o crédito ${item.userNome}`,
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: `Não`
  }).then((result: any) => {
    if (result.isConfirmed) {
      deleteCredit(item.id).then(() => {
        loadCredit()
        toast.success('Crédito excluido com sucesso!')
      })
    }
  })
}

async function edit(item: any) {
  modalOpen.value = true
  await getCredit(item.id).then(({ data }: any) => {
    credit.value = data
  })
}



function debounce(func: any, delay: number) {
  let timeoutId: any;
  return function (...args: any) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}



async function loadCredit() {
  loading.value = true
  await listCredit(
    pagination.page,
    pagination.limit,
    {
      typeValue: 'CREDIT',
      nameOrCpf: search.value,
      orderBy: '{"id": "desc"}'
    }
  ).then(({ data }: any) => {
    credits.value = data.items
    credits.value?.map(x => {
      x.userNome = x.user.name
      x.userCpf = x.user.cpf
      x.partnerName = x.partner?.name
    })
    pagination.total = data.pagination.totalQuantity
    loading.value = false
  })
}

async function loadOptions() {
  await listUser().then(({ data }: any) => {
    userOptions.value = data.items.map((item: any) => ({
      id: item.id,
      text: item.name,
      label: `${item.name} - ${item.cpf}`
    }))
  })

  await listPartners().then(({ data }: any) => {
    partnersOptions.value = data.items.map((item: any) => ({
      value: item.id,
      label: item.name
    }))
  })
}

async function Salvar() {
  if (!credit.value.value || !credit.value.userId) {
    toast.error('Campos CPF, E-mail, Nome, Empresa e Cargo são obrigatórios')
  } else {
    const newCredit = {
      value: credit.value.value,
      userId: credit.value.userId,
      originId: credit.value.originId,
      description: credit.value.description,
      typeValue: 'CREDIT',
      status: 'REQUESTED',
      voucher: credit.value.voucher,

    }

    try {
      loadingSave.value = true
      const res: any = await createCredit(newCredit)

      if (!res.response) {
        modalOpen.value = false
        loadCredit()
        toast.success('Crédito adicionado com sucesso!')
      }
      credit.value = {}
      loadingSave.value = false
    } catch (error) {
      console.log(error)
    } finally {
      loadingSave.value = false
    }

  }
}

function handleBack() {
  loadCredit()
  credit.value = {}
  search.value = ''
  modalOpen.value = false
}

async function updateStatus(id: number, status: string) {

  await updateCredit(id, { status }).then(() => {
    loadCredit();
    toast.success('Status atualizado com sucesso!');
  });
}

watch(
  () => pagination.page,
  () => {
    loadCredit()
  },
  { deep: true }
)
watch(
  () => pagination.limit,
  () => {
    loadCredit()
  },
  { deep: true }
)
watch(
  () => search.value,
  () => {
    if (search.value.length >= 3) loadCredit()

    if (!search.value) loadCredit()
  }
)


watch(
  () => searchUser.value,
  debounce(async () => {
    if (!searchUser.value) {
      loadMoreUsers()
    } else
      await listUserWithoutPagination(searchUser.value).then(({ data }: any) => {
        if (data.items.length < limit.value) {
          canLoadMore.value = false;
        }
        userOptions.value = data.items.map((item: any) => ({
          id: item.id,
          text: item.name
        }));
      });
  }, 300) // Set the desired debounce delay here (in milliseconds)
);

watch(
  () => selectedRole.value,
  () => {
    loadCredit()
  }
)

watch(credit.value, () => {
  if (credit.value.typeValue === 'CREDIT') {
    credit.value.originId = undefined
    credit.value.voucher = undefined
  }
})

watch(() => credit.value.userId, async () => {
  if (credit.value.userId) {
    loadingBalance.value = true
    await getBalance(credit.value.userId).then(({ data }: any) => {
      balance.value = data
    })
    loadingBalance.value = false
  }
})



onMounted(() => {
  observer.value = new IntersectionObserver(infiniteScroll)

  if (token.value) {
    loadOptions()
    loadCredit()
  }
})
</script>
<template>
  <div>
    <div class="flex justify-between">
      <h3 class="text-3xl font-medium text-gray-700">Créditos</h3>
      <button v-if="modalOpen" class="border border-gray-600 rounded px-2 text-md" @click="handleBack">
        Voltar
      </button>
    </div>
    <Table @remove-search="search = ''" v-if="!modalOpen" :loading="loading" :columns="columns" :rows="credits"
      :can-edit="false" :total-page="pagination.total" :current-page="pagination.page"
      :items-per-page="pagination.limit" filter-placeholder="Pesquisar por nome ou cpf" filter-default @edit-item="edit"
      @delete-item="removeUser" @changePerPage="pagination.limit = $event" @changePage="pagination.page = $event"
      @search="search = $event">
      <template #BtnTable>
        <div class="flex justify-end">
          <button class="btn-import mss-2 whitespace-nowrap" @click="router.push('importar-creditos')">
            <div class="flex">
              <span class="mx-2 mt-1">
                <IImport />
              </span>
              <span> Importar créditos </span>
            </div>
          </button>
          <button class="btn-primary mx-2" @click="modalOpen = true">Adicionar créditos</button>
        </div>
      </template>
      <template #createdAt="{ row }">
        <span>{{ new Date(row.createdAt).toLocaleDateString('pt-BR') }}</span>
      </template>
      <template #status="{ row }">
        <div v-if="row.status === 'REQUESTED'"
          class="text-[#10B981] text-center cursor-pointer flex items-center justify-center gap-2 bg-[#D1FAE5] rounded-full py-1"
          @click="updateStatus(row.id, 'PROCESSING')">
          <span>Solicitado</span>
          <IChange />
        </div>
        <div v-else-if="row.status === 'PROCESSING'"
          class="text-[#F59E0B] text-center cursor-pointer flex items-center justify-center gap-2 bg-[#FEF3C7] rounded-full py-1"
          @click="updateStatus(row.id, 'PROCESSED')">
          <span>Em Processamento</span>
          <IChange />
        </div>
        <div v-else-if="row.status === 'PROCESSED'"
          class="text-[#44abef] text-center cursor-pointer flex items-center justify-center gap-2 bg-[#cbecff] rounded-full py-1"
          @click="updateStatus(row.id, 'CANCELED')">
          <span>Processado</span>
          <IChange />
        </div>

        <div v-else-if="row.status === 'CANCELED'"
          class="text-[#EF4444] text-center cursor-pointer flex items-center justify-center gap-2 bg-[#FED7D7] rounded-full py-1"
          @click="updateStatus(row.id, 'REQUESTED')">
          <span>Cancelado</span>
          <IChange />
        </div>

      </template>
    </Table>
    <CardForm v-if="modalOpen">
      <template #content>
        <p v-if="credit.userId && !loadingBalance" class="text-lg font-semibold text-gray-700">Créditos do usuário: {{
        balance }}</p>
        <spinner v-if="credit.userId && loadingBalance" class="ml-3" />
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div> <!-- Adicione uma classe CSS para definir altura máxima e rolagem -->
            <base-input is-slot label="Usuário">

              <v-select class="w-full" v-model="credit.userId" :options="paginated" :filterable="false" label="label"
                :reduce="(item: any) => item.id" @open="onOpen" @close="onClose"
                @search="(query: any) => (searchUser = query)">
                <template #list-footer>
                  <li v-show="hasNextPage" ref="load" class="loader">
                    Carregando mais usuários...
                  </li>
                </template>
              </v-select>
            </base-input>
          </div>
          <!-- <base-input is-slot label="Usuário">
            <v-select class="w-full" v-model="credit.userId" :options="userOptions" label="text"
              :reduce="(item: any) => item.id" />
          </base-input> -->

          <div class="mt-6">
            <label for="description" class="text-gray-700 text-[14px] mb-1 block">Valor</label>
            <input v-model="credit.value" type="number" label="Valor" placeholder="Valor" step="0.01"
              class="flex-1 p-2 outline-0 text-md w-full rounded-md h-[42px] border-gray-200 placeholder:text-[#D6D6D6]" />
          </div>
          <base-input v-model="credit.description" type="text" label="Descrição" placeholder="Descrição" />
          <base-input v-if="credit.typeValue === 'DEBIT'" v-model="credit.voucher" type="text" label="Voucher"
            placeholder="Voucher" />

        </div>
        <div>
          <button :disabled="loadingSave" class="btn-saved mt-20" @click="Salvar()">Salvar Alterações
            <spinner v-if="loadingSave" class="ml-3" />
          </button>
        </div>
      </template>
    </CardForm>
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

.loader {
  text-align: center;
  color: #bbbbbb;
}
</style>
