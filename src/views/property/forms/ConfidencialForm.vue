<script lang="ts" setup>

import type { IConfidencial } from '@/types/property'
const confidencial = defineModel<IConfidencial>({
  required: true,
  default: {}
})
</script>
<template>
  <section>
    <h4 class="text-xl font-semibold text-gray-700 mb-4">Informações Confidenciais</h4>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <base-input v-model="confidencial.name" label="Nome do Proprietário" />
      <base-input v-model="confidencial.email" label="Email do Proprietário" />
      <base-input
        v-model="confidencial.cell_phone"
        mask="(##) #####-####"
        label="Telefone Celular"
      />
      <base-input v-model="confidencial.reference" label="Referência" />
      <base-input
        v-if="confidencial.observations"
        v-model="confidencial.observations"
        label="Observações"
      >
        <base-textarea v-model="confidencial.observations" class="w-full" />
      </base-input>
      <base-input v-model="confidencial.nameCJ" label="Nome da Empresa" />
      <base-input v-model="confidencial.emailCJ" label="E-mail da Empresa" rules="email" />
      <base-input
        v-model="confidencial.telephoneCJ"
        mask="(##) #####-####"
        label="Telefone da Empresa"
      />
      <base-input v-model="confidencial.codeIPTU" label="Código IPTU" />
      <base-input v-model="confidencial.registration_number" label="Número de registro" />
      <base-input v-model="confidencial.electricity_code" label="Código de Energia" />
      <base-input v-model="confidencial.water_code" label="Código de Água" />
      <base-input v-model="confidencial.documentation_observation" label="Observação documentos" />
      <base-input v-model="confidencial.titles_rights" label="Direito de Títulos" />
      <base-input label="&nbsp;">
        <base-checkbox v-model="confidencial.projects_approved" label="Projeto aprovado" />
      </base-input>
      <base-input label="&nbsp;">
        <base-checkbox
          v-model="confidencial.approved_environmental_agency"
          label="Agência Ambiental Aprovada"
        />
      </base-input>
    </div>
  </section>
</template>
