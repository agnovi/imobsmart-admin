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
  loading.value = true
  const userPayload = {
    name: user.value.name,
    email: user.value.email,
    cpf: user.value.cpf,
    status: user.value.status,
    clients: [
      {
        id_client: selectClient.value,
        id_role: selectProfile.value
      }
    ]
  }

  try {
    if (route.params.id) {
      await http.patch(`users/admin/${route.params.id}`, userPayload)
      toast.success('Usuário atualizado com sucesso')
    } else {
      await http.post('users/admin', { ...userPayload, password: user.value.password })
      toast.success('Usuário criado com sucesso')
    }
    router.back()
  } catch (error) {
    toast.error('Erro ao salvar usuário. Tente novamente.')
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
            <base-input v-if="route.fullPath !== `/editar-usuario-admin/${route.params.id}`" v-model="user.password"
              type="text" label="Senha" rules="required" />
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
