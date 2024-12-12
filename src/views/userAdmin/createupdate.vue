<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { Form } from 'vee-validate'
import * as UserServices from '@/api/services/AdminService'
import FullSpinner from '@/components/FullSpinner.vue'
import useAuth from '@/composables/useSession'
import CardForm from '@/components/CardForm.vue'
import ISave from '@/components/icones/ISave.vue'
import Select from '@/components/Select.vue'
import type { IUser } from '@/types/user'
import { http } from '@/api/api'
import Swal from 'sweetalert2'

const { token } = useAuth()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const user = ref<IUser>({
  status: true,
} as IUser)
const loading = ref(false)
const loadingSave = ref(false)

const clients = ref([])
const perfils = ref([])

const selectProfile = ref()
const selectClient = ref()

const status = ref([
  { label: 'ATIVO', value: true }, {
    label: "INATIVO", value: false
  }
])

async function getUser() {
  loading.value = true
  try {
    const res = await UserServices.getUser(String(route.params.id))
    selectClient.value = res.data.clients_users && res.data.clients_users[0]?.clients?.id_client
    selectProfile.value = res.data.clients_users && res.data.clients_users[0]?.roles?.id_role
    user.value = { ...res.data, status: res.data.status === 1 ? true : false }
  } catch (error) {
    loading.value = false
  } finally {
    loading.value = false
  }
}

async function getClients() {
  try {
    const res = await http.get('clients')
    const resProfile = await http.get('users/list/roles')
    perfils.value = resProfile.data.data.map((c: any) => {
      return {
        label: c.name,
        value: c.id_role
      }
    })
    clients.value = res.data.rows.map((c: any) => {
      return {
        label: c.name,
        value: c.id_client
      }
    })
  } catch (error) {
    loading.value = false
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (token.value) {
    if (route.fullPath === `/editar-usuario-admin/${route.params.id}`) getUser()
  }
  getClients()
})

async function handleSubmit() {

  const userPayload = {
    name: user.value.name,
    email: user.value.email,
    cpf: user.value?.cpf?.replace(/\D/g, ''),
    status: user.value.status,
    clients: [
      {
        id_client: selectClient.value,
        id_role: selectProfile.value
      }
    ]
  }

  console.log(selectProfile.value)

  if (!selectProfile.value) {
    toast.error('Selecione um perfil')
    return
  }

  if (selectProfile.value !== 1 && !selectClient.value) {
    toast.error('Selecione um cliente para o perfil selecionado')
    return
  }



  loading.value = true

  try {

    if (route.params.id) {
      await http.patch(`users/admin/${route.params.id}`, userPayload)
      toast.success('Usuário salvo com sucesso')
      router.back()
    } else {
      const responseUser = await http.get(`users/unique?email=${userPayload.email}&document=${userPayload.cpf}`)
      if (!responseUser.data) {
        await http.post('users/admin', { ...userPayload })
        toast.success('Usuário salvo com sucesso')
        router.back()
      } else {
        Swal.fire({
          title: "Usuário já existe com esse cpf/email porém está inativado",
          text: "Você deseja reativar?",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Reativar",
          confirmButtonColor: '#008000',
          cancelButtonText: 'Cancelar'
        }).then(async (result) => {
          if (result.isConfirmed) {
            await http.patch(`users/active/${responseUser.data.id_user}`)
            router.back()
          }
        })
      }


    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mt-4">
    <FullSpinner v-if="loading" />
    <div class="flex justify-between mb-3">
      <h3 class="text-3xl font-medium text-gray-700">
        {{
          route?.fullPath === '/adicionar-usuario-admin' ? 'Novo Usuário' : 'Editar Usuário'
        }}
      </h3>
      <button class="border border-gray-600 rounded px-2 text-md" @click="$router.go(-1)">
        Voltar
      </button>
    </div>
    <CardForm>
      <template #content>

        <Form @submit="handleSubmit">
          <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <base-input v-model="user.name" type="text" label="Nome Completo" rules="required|validateNameAndSurname" />
            <Select label="Status" :options="status" v-model="user.status" />
            <base-input v-model="user.cpf" type="text" label="CPF" rules="required|cpf" mask="###.###.###-##" />
            <base-input v-model="user.email" type="email" label="E-mail" rules="required|email" />
            <Select label="Perfil" :options="perfils" v-model="selectProfile" />
            <Select v-if="selectProfile !== 1" label="Clientes" :options="clients" v-model="selectClient" />
          </div>
          <div class="flex justify-end mt-8">
            <base-button type="submit" :disabled="loadingSave" :loading="loadingSave" class="max-w-fit">
              <ISave />
              Salvar Alterações
            </base-button>
          </div>
        </Form>
      </template>
    </CardForm>
  </div>
</template>
