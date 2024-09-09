<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import Table from '../components/Table.vue'
import CardForm from '../components/CardForm.vue'
import useAuth from '../composables/useSession'
import { useRouter } from 'vue-router'
import {
  createUser,
  getUser,
  listUser,
  editUser,
  deleteUser
} from '@/api/services/AdminService'
import { UserAdmin } from '@/api/model/UserModel'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'
import { validarEmail } from '@/util/helpers'
const { token } = useAuth()
const toast = useToast()
const loading = ref(false)
const loadingSave = ref(false)
const users = ref<UserAdmin[]>()
const user = ref<UserAdmin>({})
const clusterOtions = ref<any>()
const groupOtions = ref<any>()

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
    label: 'Nome',
    key: 'name'
  },
  {
    label: 'E-mail',
    key: 'email'
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

// async function listCategorias() {
//   load.showLoad()
//   try {
//     const d = await categoriaApi.listCategories(pagination.page)
//     pagination.total = d.data.count
//     categories.value = d.data.items
//   }
//   catch (error) {
//     load.closeLoad()
//   }
//   finally {
//     load.closeLoad()
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
      deleteUser(item.id).then((f: any) => {
        loadUser()
        toast.success('Usuario excluido com sucesso!')
      })
    }
  })
}

async function edit(item: any) {
  modalOpen.value = true

  await getUser(item.id, { associations: true, campaigns: true }).then(({ data }: any) => {
    console.log('get id', data)
    console.log(data)
    user.value = data
  })
}
const search = ref<string>('')
watch(
  () => pagination.page,
  () => {
    loadUser()
  },
  { deep: true }
)
watch(
  () => pagination.limit,
  () => {
    loadUser()
  },
  { deep: true }
)
watch(
  () => search.value,
  () => {
    if (search.value.length >= 3) loadUser()

    if (!search.value) loadUser()
  }
)

async function loadUser() {
  if (!token.value) return
  loading.value = true
  await listUser(
    pagination.page,
    pagination.limit,
    search.value
      ? {
        name: {
          contains: search.value
        }
      }
      : undefined
  ).then(({ data }: any) => {
    users.value = data.items
    pagination.total = data.pagination.totalQuantity
    loading.value = false
  })
  // await recoverTokenValidation('83398420-a880-4d5f-8aa6-b729ab13d109').then((f: any) => console.log(f));
  // await completeRegistration(4).then((f:any) => console.log(f));
}

async function Salvar() {
  if (user.value.password !== user.value.confirm) {
    toast.error('Senhas não conferem')
  } else
    if (!user.value.email || !user.value.name) {
      toast.error('Campos CPF, E-mail e Nome Obrigatórios')
    } else if (!validarEmail(user.value.email)) {
      toast.error('E-mail inválido')
    } else {
      const newUser = {
        name: user.value.name,
        email: user.value.email,
        password: user.value.password,
      } as any
      console.log('editar usuario', newUser)
      console.log('clustter', clusterOtions.value)
      console.log('groups', groupOtions.value)
      if (!user.value.id) {
        try {
          loadingSave.value = true
          newUser.status = 'ACTIVE'
          const res: any = await createUser(newUser)

          if (!res.response) {
            modalOpen.value = false
            loadUser()
            toast.success('Usuario adicionado com sucesso!')
          }
          loadingSave.value = false
        } catch (error) {
          toast.success('E')
        }
      } else {
        const iduser = {
          ...newUser,
          id: user.value.id
        }
        try {
          loadingSave.value = true
          const res: any = await editUser(iduser)

          if (!res.response) {
            modalOpen.value = false
            loadUser()
            toast.success('Usuario editado com sucesso!')
          }
          loadingSave.value = false
        } catch (error) {
          toast.success('E')
        }
      }
    }
}

function handleBack() {
  loadUser()
  user.value = {}
  modalOpen.value = false
}

onMounted(() => {
  loadUser()
})
</script>
<template>
  <div>
    <div class="flex justify-between">
      <h3 class="text-3xl font-medium text-gray-700">Usuários Admin</h3>
      <button v-if="modalOpen" class="border border-gray-600 rounded px-2 text-md" @click="handleBack">
        Voltar
      </button>
    </div>
    <Table v-if="!modalOpen" :loading="loading" :columns="columns" :rows="users" :total-page="pagination.total"
      :current-page="pagination.page" :items-per-page="pagination.limit" :filter-default="true" @edit-item="edit"
      @delete-item="removeUser" @changePerPage="pagination.limit = $event" @changePage="pagination.page = $event"
      @search="search = $event">
      <template #BtnTable>
        <div class="flex justify-end">
          <button class="btn-primary mx-2 whitespace-nowrap" @click="modalOpen = true">Adicionar usuários</button>
        </div>
      </template>
      <template #status="{ row }">
        <div v-if="row.status === 'ACTIVE'" class="text-[#10B981] text-center bg-[#D1FAE5] rounded-full py-1">
          <span>Ativo</span>
        </div>
        <div v-else-if="row.status === 'PENDING'" class="text-[#F59E0B] text-center bg-[#FEF3C7] rounded-full py-1">
          <span>Pendente</span>
        </div>
        <div v-else-if="row.status === 'INACTIVE'" class="text-[#C53030] text-center bg-[#FEE2E2] rounded-full py-1">
          <span>Inativo</span>
        </div>
        <div v-else-if="row.status === 'DELETED'" class="text-[#6B7280] text-center bg-[#E5E7EB] rounded-full py-1">
          <span>Deletado</span>
        </div>
        <div v-else-if="row.status === 'BLOCKED'" class="text-[#EF4444] text-center bg-[#FED7D7] rounded-full py-1">
          <span>Bloqueado</span>
        </div>
      </template>
    </Table>
    <CardForm v-if="modalOpen">
      <template #content>
        <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          <div>
            <form class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
              <base-input v-model="user.name" type="text" label="Nome Completo" rules="required" />
              <base-input v-model="user.email" type="email" label="E-mail" rules="required" />
              <base-input v-if="!user.id" v-model="user.password" type="password" label="Senha" rules="required" />
              <base-input v-if="!user.id" v-model="user.confirm" type="password" label="Confirmar Senha"
                rules="required" />



            </form>
          </div>
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
</style>
