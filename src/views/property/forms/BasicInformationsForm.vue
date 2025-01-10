<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { http } from '@/api/api'
import Pdf from '@/components/icones/Pdf.vue'

import type { IProperty } from '@/types/property'
const data = defineModel<IProperty>({
  required: true,
  default: {}
})

const typesOptions = ref([])
const typesNegotiation = ref([
  { label: 'Venda', value: 'venda' },
  { label: 'Aluguel', value: 'locacao' }
])

const statusOptions = ref([
  { label: 'Publicado', value: 'PUBLICADO' },
  { label: 'Rascunho', value: 'RASCUNHO' },
  { label: 'Inativo', value: 'INATIVO' }
])

async function getTypesProperty() {
  try {
    const res = await http.get('property/types')
    typesOptions.value = res.data?.rows?.map((c: any) => {
      return {
        label: c.name,
        value: c.id_propertys_type
      }
    })
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getTypesProperty()
})
</script>

<template>
  <section>
    <div class="flex items-center mb-4 gap-3">
      <h4 class="text-xl font-semibold text-gray-700">Informações Básicas</h4>
    </div>
    <div class="flex items-center gap-3 mb-4">
      <div class=" items-center gap-3">
        <p class="text-gray-700">Imobiliária</p>
        <div class="flex items-center gap-3">
          <p v-if="data.name_table" class="">{{ data.name_table }}</p>
        </div>
      </div>
      <div class=" items-center gap-3 ml-10">
        <p class="text-gray-700">Link da tabela</p>
        <div class="flex items-center gap-3 mt-3">
          <div v-if="data.link_table">
            <a v-tooltip="'Tabela'" :href="data.link_table" target="_black">
              <Pdf />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-5">
      <div class="col-span-1 sm:col-span-3">
        <base-input v-model="data.name_table" label="Nome da Tabela" />
      </div>
      <base-input v-model="data.status" label="Status" is-slot>
        <base-select v-model="data.status" :options="statusOptions" />
      </base-input>
    </div>
    <div class="grid grid-cols-1 gap-6 mb-5">
      <base-input v-model="data.link_table" label="Link da Tabela" />
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <base-input v-model="data.title" label="Título do Imóvel" />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <base-input v-model="data.id_type" label="Tipo do imóvel" is-slot>
          <base-select v-model="data.id_type" :options="typesOptions" />
        </base-input>
        <base-input v-model="data.negotiation" label="Tipo de negociação" is-slot>
          <base-select v-model="data.negotiation" :options="typesNegotiation" />
        </base-input>
      </div>
      <base-input v-model="data.address" label="Endereço" />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <base-input v-model="data.neighborhoods" label="Bairro" />
        <base-input v-model="data.citys" label="Cidade" />
      </div>
      <div class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        <base-input v-model="data.useful_area" label="Área Útil (m²)" min="0" type="number" />
        <base-input v-model="data.suites" label="Número de Suites" type="number" min="0" />
        <base-input
          v-model="data.dormitory_number"
          label="Número de Dormitórios"
          type="number"
          min="0"
        />
        <base-input v-model="data.vacancies" label="Número de Vagas" min="0" type="number" />
        <!-- <base-input v-model="data.bathroom" label="Número de Banheiros" min="0" type="number" /> -->
        <!-- <base-input label="&nbsp;">
          <base-checkbox v-model="data.accepts_pets" label="Aceita Pets?" />
        </base-input> -->
      </div>
    </div>

    <base-input label="Descrição" class="mt-5">
      <base-editor v-model="data.description" class="w-full" />
    </base-input>
  </section>

  <!-- Financial Information -->
  <section class="mt-6">
    <h4 class="text-xl font-semibold text-gray-700 mb-4">Informações Financeiras</h4>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <!-- <base-input
        v-model="data.condominium_value"
        is-money
        label="Valor do Condomínio"
        min="0"
        type="number"
      /> -->
      <!-- <base-input v-model="data.IPTU_value" is-money label="Valor do IPTU" min="0" type="number" /> -->
      <!-- <base-input v-model="data.square_meter_sale" is-money label="Valor por m²" min="0" type="number" /> -->
      <base-input v-model="data.sale_value" is-money label="Valor de Venda" min="0" />
      <!-- <base-input v-model="data.location" label="Localização" min="0" /> -->
    </div>
  </section>
</template>
