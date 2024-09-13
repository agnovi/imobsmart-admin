<script lang="ts" setup>

import type { IAnuncio } from '@/types/property'
const anuncio = defineModel<IAnuncio>({
  required: true,
  default: {}
})
</script>
<template>
  <section>
    <h4 class="text-xl font-semibold text-gray-700 mb-4">Anúncio</h4>
    <div class="grid grid-cols-1 gap-6">
      <base-checkbox v-model="anuncio.web_advertisement" label="Anúncio na Web" />
      <base-checkbox v-model="anuncio.emphasis" label="Ênfase" />
      <base-checkbox v-model="anuncio.super_highlight" label="Super destaque" />
      <base-checkbox v-model="anuncio.advertising_in_print_media" label="Publicidade média" />
      <base-input v-model="anuncio.title" label="Título do Anúncio" />
      <base-input
        v-model="anuncio.characteristics_of_the_property"
        label="Característica do Imóvel"
        is-slot
      >
        <base-textarea v-model="anuncio.characteristics_of_the_property" class="w-full" />
      </base-input>
      <base-input v-model="anuncio.differences" label="Diferenças" />
      <base-input v-model="anuncio.leisure_area" label="Área de Lazer" />
      <base-input v-model="anuncio.privileged_location" label="Localização Privilegiada" />
      <base-input v-model="anuncio.location" label="Localização" />
      <base-input v-model="anuncio.printed_media" label="Mídia impressa" />
      <base-input
        v-model="anuncio.printed_media_description"
        label="Descrição Mídia Impressa"
        is-slot
      >
        <base-textarea v-model="anuncio.printed_media_description" class="w-full" />
      </base-input>
      <base-checkbox v-model="anuncio.sign_on_site" label="Sign Site" />
      <base-input v-model="anuncio.placement_request" label="Posicionamento" />
      <base-input v-model="anuncio.placement_date" type="date" label="Data de Posicionamento" />
      <base-input v-model="anuncio.withdrawal_request" label="Solicitação de Retirada" />
      <base-input v-model="anuncio.withdrawal_date" type="date" label="Data de Retirada" />
    </div>
  </section>
</template>
