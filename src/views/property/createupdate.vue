<script lang="ts" setup>
import { Form } from 'vee-validate'
import ISave from '@/components/icones/ISave.vue'
import * as PropertyServices from '@/api/services/PropertyService'
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import useAuth from '@/composables/useSession'
import type { IProperty } from '@/types/property'
import { residentialOptions} from '@/util/constants'
const { token } = useAuth()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const data = ref<IProperty>({
  title: '',
  address: '',
  useful_area: 0,
  dormitory_number: 0,
  vacancies: 0,
  bathroom: 0,
  accepts_pets: false,
  description: '',
  condominium_value: 0,
  IPTU_value: 0,
  location: '',
  square_meter_sale: 0,
  sale_value: 0,
  images: '',
  image_detach: '',
  id_cond_ed: 0,
  details: {
    total_area_land: 0,
    built_useful: 0,
    common_area: 0,
    private_area: 0,
    external_area: 0,
    maneuvering_area: 0,
    patio_area: 0,
    go_free: '',
    Topography: '',
    Property_face: '',
    property_position: '',
    cabinets: '',
    floor: '',
    intimate: '',
    social: '',
    leisure: '',
    services: '',
    infrastructure: ''
  },
  dadosprim: {
    reference: '',
    sale: 0,
    sale_valuation: 0,
    rental: 0,
    rental_evaluation: 0,
    condominium: 0,
    leased: false,
    accommodates_how_many_people: 0,
    type_of_rental: '',
    dt_evaluatio: '',
    useful_built_area: 0,
    common_area: 0,
    private_area: 0,
    total_land_area: 0,
    go_free: '',
    auth_to_negotiate: false,
    end_of_authorization: '',
    exclusive: false,
    end_of_exclusive: '',
    registered_by: '',
    alternative_reference: '',
    status: false,
    type: '',
    purpose: '',
    name: '',
    standard: '',
    zoning: '',
    gated_condominium: false,
    default_location: '',
    IPTU_value: 0,
    year_construction: 0,
    reform_year: 0,
    used_FGTS_in_the_last_3_years: false,
    accept_exchange: false,
    accept_financing: false,
    situation: '',
    needs_renovation: '',
    rental_guarantee_accepted_by_the_owner: '',
    internal_comments: '',
    commercial_condition: '',
    nearby_meters: '',
    pickup: '',
    files: '',
    pass_on_promotion_payment_conditions: '',
    method_of_paying_the_outstanding_balance: ''
  },
  anuncio: {
    web_advertisement: false,
    emphasis: false,
    super_highlight: false,
    portals: '',
    title: '',
    characteristics_of_the_property: '',
    differences: '',
    leisure_area: '',
    privileged_location: '',
    location: '',
    advertising_in_print_media: false,
    printed_media: '',
    printed_media_description: '',
    sign_on_site: false,
    placement_request: '',
    placement_date: '',
    withdrawal_request: '',
    withdrawal_date: ''
  },
  confidencial: {
    reference: '',
    name: '',
    email: '',
    cell_phone: '',
    observations: '',
    nameCJ: '',
    emailCJ: '',
    telephoneCJ: '',
    codeIPTU: '',
    registration_number: '',
    electricity_code: '',
    water_code: '',
    documentation_observation: '',
    titles_rights: '',
    projects_approved: false,
    approved_environmental_agency: false
  }
})
const loadingSave = ref(false)

async function onSubmit() {
  loadingSave.value = true
  try {
    if (!data.value.id) {
      await PropertyServices.create(data.value)
    } else {
      await PropertyServices.edit(data.value, data.value.id)
    }
    toast.success(`Imóvel ${!data.value.id ? 'criado' : 'editado'} com sucesso!`)
    router.push('/imoveis')
  } catch (error) {
    console.error('Erro ao salvar o imóvel:', error)
  } finally {
    loadingSave.value = false
  }
}
</script>

<template>
  <div class="mt-4">
    <div class="flex justify-between mb-3">
      <h3 class="text-3xl font-medium text-gray-700">
        {{ route?.fullPath === '/adicionar-imovel' ? 'Novo Imóvel' : 'Editar Imóvel' }}
      </h3>
      <button class="border border-gray-600 rounded px-2 text-md" @click="$router.go(-1)">
        Voltar
      </button>
    </div>
    <Form @submit="onSubmit" class="p-6 bg-white rounded-md shadow-md space-y-6">
      <!-- Basic Information -->
      <section>
        <h4 class="text-xl font-semibold text-gray-700 mb-4">Informações Básicas</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <base-input v-model="data.title" label="Título do Imóvel" />
          <base-input v-model="data.residential_type" label="Tipo do imóvel" is-slot>
            <base-select v-model="data.residential_type" :options="residentialOptions" />
          </base-input>
          <base-input v-model="data.address" label="Endereço" />
          <div class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            <base-input v-model="data.useful_area" label="Área Útil (m²)" min="0" type="number" />
            <base-input
              v-model="data.dormitory_number"
              label="Número de Dormitórios"
              type="number"
              min="0"
            />
            <base-input v-model="data.vacancies" label="Número de Vagas" min="0" type="number" />
            <base-input v-model="data.bathroom" label="Número de Banheiros" min="0" type="number" />
            <base-input label="&nbsp;">
              <base-checkbox v-model="data.accepts_pets" label="Aceita Pets?" />
            </base-input>
          </div>
        </div>
      </section>

      <!-- Description -->
      <section>
        <h4 class="text-xl font-semibold text-gray-700 mb-4">Descrição</h4>
        <base-input is-slot>
            <base-textarea v-model="data.description" class="w-full" />
        </base-input>
      </section>

      <!-- Financial Information -->
      <section>
        <h4 class="text-xl font-semibold text-gray-700 mb-4">Informações Financeiras</h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <base-input v-model="data.condominium_value" label="Valor do Condomínio" min="0" type="number" />
          <base-input v-model="data.IPTU_value" label="Valor do IPTU" min="0" type="number" />
          <base-input v-model="data.sale_value" label="Valor de Venda" min="0" />
        </div>
      </section>

      <!-- Anuncio Section -->
      <section>
        <h4 class="text-xl font-semibold text-gray-700 mb-4">Anúncio</h4>
        <div class="grid grid-cols-1 gap-6">
          <base-checkbox v-model="data.anuncio.web_advertisement" label="Anúncio na Web" />
          <base-checkbox v-model="data.anuncio.emphasis" label="Ênfase" />
          <base-input v-model="data.anuncio.title" label="Título do Anúncio" />
        </div>
      </section>

      <!-- Confidential Information -->
      <section>
        <h4 class="text-xl font-semibold text-gray-700 mb-4">Informações Confidenciais</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <base-input v-model="data.confidencial.name" label="Nome do Proprietário" />
          <base-input v-model="data.confidencial.email" label="Email do Proprietário" />
          <base-input
            v-model="data.confidencial.cell_phone"
            mask="(##) #####-####"
            label="Telefone Celular"
          />
        </div>
      </section>

      <!-- Submit Button -->
      <div class="flex justify-end mt-8">
        <base-button
          type="submit"
          :disabled="loadingSave"
          :loading="loadingSave"
          class="max-w-fit"
        >
          <ISave />
          Salvar
        </base-button>
      </div>
    </Form>
  </div>
</template>
