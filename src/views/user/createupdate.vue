<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { Form } from 'vee-validate'
import * as UserServices from '@/api/services/User'
import FullSpinner from '@/components/FullSpinner.vue'
import useAuth from '@/composables/useSession'
import CardForm from '@/components/CardForm.vue'
import ISave from '@/components/icones/ISave.vue'

import type { IClients } from '@/types/user'
import Select from '@/components/Select.vue'
import { http } from '@/api/api'
const { token } = useAuth()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const status = ref([
  { label: 'ATIVO', value: 'ATIVO' }, {
    label: "INATIVO", value: 'INATIVO'
  }
])

const type = ref([
  { label: 'Pessoa Física', value: 'PF' }, {
    label: "Pessoa Juridíca", value: 'PJ'
  }
])
const user = ref<IClients>({
  status: 'ATIVO',
  type: 'PF'
} as IClients)
const loading = ref(false)
const loadingSave = ref(false)
const plans = ref<any[]>([])

async function getUser() {
  const res = await UserServices.getUser(String(route.params.id))
  user.value = { ...res.data, id_plan: res.data?.clients_plans?.plans?.id_plan }
}

function handleBack() {
  const queryParams = router.currentRoute.value.query; // Captura as queries atuais
  router.push({ path: '/usuarios', query: queryParams }); // Retorna mantendo as queries
}

onMounted(() => {
  if (token.value) {
    if (route.params.id) getUser()
  }

  getePlans()
})

async function getePlans() {
  try {
    const res = await http.get('/plans')
    plans.value = res.data.rows.map((p: any) => {
      return {
        label: p.name,
        value: p.id_plan
      }
    })
    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}

async function handleSubmit() {

  const userPayload = {
    name: user.value.name,
    email: user.value.email,
    document: user.value.document.replace(/\D/g, ''),
    status: user.value.status,
    phone: user.value.phone ? user.value.phone.replace(/\D/g, '') : '',
    type: user.value.type,
    id_plan: user.value.id_plan
  }

  if (!user.value.id_plan) {
    toast.error('Selecione um plano')
    return
  }
  loading.value = true
  try {
    if (route.params.id) {
      await http.patch(`clients/${route.params.id}`, userPayload)
      toast.success('Cliente atualizado com sucesso')
    } else {
      await http.post('clients', { ...userPayload })
      toast.success('Cliente criado com sucesso')
    }
    handleBack()
  } catch (error) {
    loading.value = false
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
        {{ route?.fullPath === '/adicionar-usuario' ? 'Novo Cliente' : 'Editar Cliente' }}
      </h3>
      <button class="border border-gray-600 rounded px-2 text-md" @click="handleBack">
        Voltar
      </button>
    </div>
    <CardForm>
      <template #content>
        <Form @submit="handleSubmit">
          <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-3">
            <base-input v-model="user.name" type="text" label="Nome Completo" rules="required" />
            <Select label="Tipo" :options="type" v-model="user.type" />
            <Select label="Status" :options="status" v-model="user.status" />
          </div>
          <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">

            <base-input v-if="user.type === 'PF'" v-model="user.document" type="text" label="CPF" rules="required|cpf"
              mask="###.###.###-##" />
            <base-input v-if="user.type === 'PJ'" v-model="user.document" type="text" label="CNPJ" rules="required|cnpj"
              mask="##.###.###/####-##" />
            <base-input v-model="user.email" label="E-mail" rules="required|email" />
            <base-input v-model="user.phone" label="Telefone" mask="(##) #####-####" rules="required" />
            <Select :disabled="!!route.params.id" label="Planos" :options="plans" v-model="user.id_plan" />
          </div>
          <div class="flex justify-end">
            <base-button type="submit" :disabled="loadingSave" :loading="loadingSave" class="mt-10 max-w-fit">
              <ISave />

              Salvar Alterações
            </base-button>
          </div>
        </Form>
      </template>
    </CardForm>
  </div>
</template>
