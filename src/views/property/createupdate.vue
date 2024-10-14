<script lang="ts" setup>
import { Form } from 'vee-validate'
import ISave from '@/components/icones/ISave.vue'
import * as PropertyServices from '@/api/services/PropertyService'
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import useAuth from '@/composables/useSession'
import type {
  IConfidencial,
  IProperty,
  IDadosprim,
  IDetails,
  IAnuncio,
  PropertysImage
} from '@/types/property'
import BasicInformations from './forms/BasicInformationsForm.vue'
import MainInformations from './forms/MainInformationsForm.vue'
import Details from './forms/DetailsForm.vue'
import Anuncio from './forms/AnuncioForm.vue'
import Confidencial from './forms/ConfidencialForm.vue'
import ImagesForm from './forms/ImagesForm.vue'
import Tabs from '@/components/Tabs.vue'
import { removeNullFields } from '@/util/helpers'

const mock = {
  accepts_pets: false,
  address: 'teste',
  anuncio: {
    advertising_in_print_media: true,
    characteristics_of_the_property: 'teste',
    differences: 'teste',
    emphasis: true,
    leisure_area: 'tes',
    location: 'teste',
    placement_date: '2024-02-09',
    placement_request: 'teste',
    portals: '',
    printed_media: true,
    printed_media_description: 'teste',
    privileged_location: 'te',
    sign_on_site: true,
    super_highlight: true,
    title: 'teste',
    web_advertisement: true,
    withdrawal_date: '2024-09-09',
    withdrawal_request: 'teste'
  },
  bathroom: 2,
  condominium_value: 123,
  confidencial: {
    approved_environmental_agency: true,
    cell_phone: '(11) 65456-4564',
    codeIPTU: '15646',
    documentation_observation: 'teste docs ',
    electricity_code: '56456',
    email: 'joao@email.com',
    emailCJ: 'emaiempresa@email.com',
    name: 'Joao marçal',
    nameCJ: 'empresa ',
    observations: '',
    projects_approved: true,
    reference: 'teste ref 4',
    registration_number: '5646',
    telephoneCJ: '(11) 23161-5646',
    titles_rights: 'sim tem direito',
    water_code: '45646'
  },
  dadosprim: {
    accept_exchange: true,
    accept_financing: true,
    accommodates_how_many_people: 9,
    alternative_reference: 'teste ref2',
    auth_to_negotiate: true,
    commercial_condition: 'teste',
    common_area: 300,
    condominium: '123',
    default_location: 'sp',
    dt_evaluatio: '2014-09-09',
    end_of_authorization: 'teste fim ',
    end_of_exclusive: 'teste fim ex',
    exclusive: true,
    files: 'link?',
    gated_condominium: true,
    go_free: 75,
    internal_comments: 'comentario teste',
    IPTU_value: '120',
    leased: true,
    method_of_paying_the_outstanding_balance: '60x',
    name: 'nome imovel ?',
    nearby_meters: 'tete',
    needs_renovation: 'nao precisa, é novo!',
    pass_on_promotion_payment_conditions: 'sim 360x',
    pickup: 'Joao corretor',
    private_area: 75,
    purpose: 'props 2',
    reference: 'teste ref',
    reform_year: 2023,
    registered_by: 'Rodrigo borges',
    rental: 0,
    rental_evaluation: '1800',
    rental_guarantee_accepted_by_the_owner: 'sim garantia',
    sale: '350000',
    sale_valuation: '330000',
    situation: 'NOvo',
    standard: 'Alto padrao',
    status: true,
    total_land_area: 75,
    type: 'tp 2',
    type_of_rental: 'teste tp alg',
    used_FGTS_in_the_last_3_years: true,
    useful_built_area: 75,
    year_construction: 2023,
    zoning: 'Oeste'
  },
  description: 'teste desc',
  details: {
    built_useful: 123,
    cabinets: 'não tem armario novo',
    common_area: 123,
    external_area: 123,
    floor: 'chao sem pisos',
    go_free: 123,
    infrastructure: 'infra? lojas? padaria?',
    intimate: 'intimo ?',
    leisure: 'lazer tem campo',
    maneuvering_area: 123,
    patio_area: 13,
    private_area: 123,
    Property_face: '50m',
    property_position: 'vertical',
    services: 'serviços ?',
    social: 'social sim',
    Topography: 'teste topografia regular',
    total_area_land: 123
  },
  dormitory_number: 2,
  image_detach: '',
  propertys_images: [
    {
      url: 'https://system.soprojetos.com.br/files/1491/project_page_e/PAD-COD43-FOTO-1-WEB.jpg?1659015535',
      id: 12
    }
  ],
  IPTU_value: 132,
  location: 'teste loc',
  residential_type: 'APARTMENT',
  sale_value: '330000',
  square_meter_sale: 7000,
  title: 'Teste 1223',
  useful_area: 123,
  vacancies: 1
}

const toast = useToast()
const router = useRouter()
const route = useRoute()
const { token } = useAuth()

const mainInfo = ref<IDadosprim>({})

const anuncio = ref<IAnuncio>({})
const imageForm = ref<any>(null)
const confidencial = ref<IConfidencial>({})
const details = ref<IDetails>({})
const basicInfo = ref<IProperty>({})
const tabList = [
  'Informações Básicas',
  // 'Informações Principais',
  // 'Detalhes',
  // 'Anuncio',
  // 'Confidêncial',
  'Imagens'
]

const loadingSave = ref(false)
const activeTab = ref('Informações Básicas')

async function onSubmit() {
  loadingSave.value = true
  try {
    const body: IProperty = {
      ...basicInfo.value,
      images:
        basicInfo.value?.propertys_images?.map((img) => {
          return { url: img!.url, emphase: img.emphase ? 1 : 0 }
        }) || []
    }

    delete body.propertys_images

    // if(Object.keys(details.value).length > 0)
    //   body.details = details.value
    // if(Object.keys(anuncio.value).length > 0)
    //   body.anuncio = { ...anuncio.value, placement_date: anuncio.value?.placement_date?.split('T')[0], withdrawal_date: anuncio.value?.withdrawal_date?.split('T')[0] }
    // if(Object.keys(confidencial.value).length > 0)
    //   body.confidencial = confidencial.value
    // if(Object.keys(mainInfo.value).length > 0)
    //   body.dadosprim = mainInfo.value

    const bodySemNull = removeNullFields(body)

    if (!basicInfo.value.id_property) {
      await PropertyServices.create(bodySemNull)
    } else {
      await PropertyServices.edit(bodySemNull, basicInfo.value.id_property)
    }

    toast.success(`Imóvel ${!basicInfo.value.id_property ? 'cadastrado' : 'editado'} com sucesso!`)
    router.push('/imoveis')
  } catch (error) {
    console.error('Erro ao salvar o imóvel:', error)
  } finally {
    loadingSave.value = false
  }
}

async function load() {
  const res = await PropertyServices.getById(String(route.params.id))
  basicInfo.value = { ...res.data }
  // mainInfo.value = { ...res.data.data.dadosprim[0] }
  // details.value = { ...res.data.data.details[0] }
  // anuncio.value = { ...res.data.data.anuncia[0] }
  // confidencial.value = { ...res.data.data.confidencial[0] }

  // if (basicInfo.value.anuncia) delete basicInfo.value.anuncia

  // delete basicInfo.value.dadosprim
  // delete basicInfo.value.details
  // delete basicInfo.value.anuncio
  // delete basicInfo.value.confidencial

  if (!Array.isArray(basicInfo.value?.propertys_images)) basicInfo.value.propertys_images = []
}

function handleUpdateListImages(imgItems: PropertysImage[]) {
  basicInfo.value.propertys_images = imgItems
}

onMounted(() => {
  // const res = { data: mock }
  // basicInfo.value = { ...res.data.data }
  // mainInfo.value = { ...res.data.data.dadosprim }
  // details.value = { ...res.data.data.details }
  // anuncio.value = { ...res.data.data.anuncio }
  // confidencial.value = { ...res.data.data.confidencial }
  if (token.value && route.params.id) {
    load()
  }
})
</script>

<template>
  <div class="mt-4">
    <div class="flex justify-between mb-3">
      <div class="flex items-center gap-5">
        <h3 class="text-3xl font-medium text-gray-700">
          {{ route?.fullPath === '/adicionar-imovel' ? 'Novo Imóvel' : 'Editar Imóvel' }}
        </h3>
        <span
          v-if="basicInfo.cod_unique"
          class="flex items-center justify-center p-[8px] rounded w-fit bg-white text-[#6B7280] text-sm"
          >#{{ basicInfo.cod_unique }}</span
        >
      </div>
      <button class="border border-gray-600 rounded px-2 text-md" @click="$router.go(-1)">
        Voltar
      </button>
    </div>

    <Form @submit="onSubmit" class="p-6 bg-white rounded-md shadow-md space-y-6">
      <Tabs :list="tabList" :active="activeTab" @setTab="activeTab = $event">
        <template #tabs-body>
          <!-- Basic Information -->
          <BasicInformations v-if="activeTab === 'Informações Básicas'" v-model="basicInfo" />

          <!-- Main Information -->
          <MainInformations v-if="activeTab === 'Informações Principais'" v-model="mainInfo" />

          <!-- Detalhes -->
          <Details v-if="activeTab === 'Detalhes'" v-model="details" />

          <!-- Anuncio Section -->
          <Anuncio v-if="activeTab === 'Anuncio'" v-model="anuncio" />

          <!-- Confidential Information -->
          <Confidencial v-if="activeTab === 'Confidêncial'" v-model="confidencial" />

          <!-- Imagens -->
          <ImagesForm
            v-if="activeTab === 'Imagens'"
            ref="imageForm"
            :images="basicInfo.propertys_images"
            @updateImageList="handleUpdateListImages"
          />
        </template>
      </Tabs>

      <!-- Submit Button -->
      <div class="flex justify-end mt-8">
        <base-button
          type="submit"
          :disabled="loadingSave || imageForm?.loadingSaveImage"
          :loading="loadingSave || imageForm?.loadingSaveImage"
          class="max-w-fit"
        >
          <ISave />
          Salvar
        </base-button>
      </div>
    </Form>
  </div>
</template>
