<script lang="ts" setup>

import type { IDetails } from '@/types/property'
const details = defineModel<IDetails>({
  required: true,
  default: {}
})
</script>
<template>
  <section>
    <h4 class="text-xl font-semibold text-gray-700 mb-4">Detalhes</h4>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <base-input v-model="details.total_area_land" type="number" min="0" label="Área Todal (m²)" />
      <base-input
        v-model="details.built_useful"
        type="number"
        min="0"
        label="Área Contruída Útil (m²)"
      />
      <base-input v-model="details.common_area" type="number" min="0" label="Área Comum" />
      <base-input v-model="details.private_area" type="number" min="0" label="Área Privada" />
      <base-input v-model="details.external_area" type="number" min="0" label="Área Externa" />
      <base-input
        v-model="details.maneuvering_area"
        type="number"
        min="0"
        label="Área de Manobra"
      />
      <base-input v-model="details.patio_area" type="number" min="0" label="Área de Pátio" />
      <base-input v-model="details.go_free" type="number" min="0" label="go_free" />
      <base-input v-model="details.Topography" label="Topografia" />
      <base-input v-model="details.Property_face" label="Imóvel Frente" />
      <base-input v-model="details.property_position" label="Posição Imóvel" />
      <base-input v-model="details.cabinets" label="Armários" />
      <base-input v-model="details.floor" label="Chão" />
      <base-input v-model="details.intimate" label="Íntimo" />
      <base-input v-model="details.social" label="Social" />
      <base-input v-model="details.leisure" label="Lazer" />
      <base-input v-model="details.services" label="Serviços" />
      <base-input v-model="details.infrastructure" label="Infraestrutura" />
    </div>
  </section>
</template>
