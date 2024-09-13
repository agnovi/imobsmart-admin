<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { Form } from 'vee-validate'
import * as UserServices from '@/api/services/AdminService'
import FullSpinner from '@/components/FullSpinner.vue'
import { customFilter } from '@/util/helpers'
import useAuth from '@/composables/useSession'
import CardForm from '@/components/CardForm.vue'
import ISave from '@/components/icones/ISave.vue'

import type { IUser } from '@/types/user'
const { token } = useAuth()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const statusOtions = ref<any[]>([
  { id: 'ACTIVE', text: 'Ativo' },
  { id: 'INACTIVE', text: 'Inativo' },
  { id: 'PRE_REGISTER', text: 'Pré registrado' }
])
const sexOptions = [
  { label: 'Masculino', value: 'MALE' },
  { label: 'Feminino', value: 'FEMALE' }
]
const user = ref<IUser>({})
const loading = ref(false)
const loadingSave = ref(false)

async function getUser() {
  const res = await UserServices.getUser(String(route.params.id))
  user.value = { ...res.data }
}

onMounted(() => {
  if (token.value) {
    if (route.fullPath === `/editar-usuario-admin/${route.params.id}`) getUser()
  }
})

async function handleSubmit() {
  const body: IUser = {
    name_lastname: user.value.name_lastname,
    cpf: user.value?.cpf?.replace(/\D/g, ''),
    cellphone: user.value?.cellphone?.replace(/\D/g, ''),
    sex: user.value.sex,
    email: user.value.email,
    telephone: user.value?.telephone?.replace(/\D/g, ''),
    cnpj: user.value?.cnpj?.replace(/\D/g, ''),
    rg: user.value.rg,
    hobbie: user.value.hobbie,
    nickname: user.value.nickname,
    password: user.value.password,
    education: user.value.education
  }

  const resetUser = () => {
    user.value = {}
  }

  loadingSave.value = true
  try {
    if (!user.value.id) {
      await UserServices.createUser(body)
      // resetUser()
    } else {
      delete body.password
      await UserServices.editUser({ ...body, id: user.value.id })
    }
    toast.success(`Usuário ${!user.value.id ? 'criado' : 'editado'} com sucesso!`)
  } catch (error) {
    console.error('Erro ao salvar o usuário:', error)
  } finally {
    loadingSave.value = false
  }
}
</script>

<template>
  <div class="mt-4">
    <FullSpinner v-if="loading" />
    <div class="flex justify-between mb-3">
      <h3 class="text-3xl font-medium text-gray-700">
        {{
          route?.fullPath === '/adicionar-usuario' ? 'Novo Usuário admin' : 'Editar Usuário admin'
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
            <base-input
              v-model="user.name_lastname"
              type="text"
              label="Nome Completo"
              rules="required|validateNameAndSurname"
            />
            <base-input
              v-model="user.cpf"
              type="text"
              label="CPF"
              rules="required|cpf"
              mask="###.###.###-##"
            />
            <base-input v-model="user.email" type="email" label="E-mail" rules="email" />
          </div>
          <div class="flex justify-end mt-8">
            <base-button
              type="submit"
              :disabled="loadingSave"
              :loading="loadingSave"
              class="max-w-fit"
            >
              <ISave />
              Salvar Alterações
            </base-button>
          </div>
        </Form>
      </template>
    </CardForm>
  </div>
</template>
