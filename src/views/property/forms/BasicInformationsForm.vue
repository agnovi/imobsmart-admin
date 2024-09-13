<script lang="ts" setup>
import { residentialOptions } from '@/util/constants'

import type { IProperty } from '@/types/property'
const data = defineModel<IProperty>({
  required: true,
  default: {}
})
</script>
<template>
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

    <base-input label="Descrição" is-slot>
      <base-textarea v-model="data.description" class="w-full" />
    </base-input>
  </section>

  <!-- Financial Information -->
  <section class="mt-6">
    <h4 class="text-xl font-semibold text-gray-700 mb-4">Informações Financeiras</h4>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <base-input
        v-model="data.condominium_value"
        label="Valor do Condomínio"
        min="0"
        type="number"
      />
      <base-input v-model="data.IPTU_value" label="Valor do IPTU" min="0" type="number" />
      <base-input v-model="data.square_meter_sale" label="Valor por m²" min="0" type="number" />
      <base-input v-model="data.sale_value" label="Valor de Venda" min="0" />
      <base-input v-model="data.location" label="Localização" min="0" />
    </div>
  </section>
</template>
