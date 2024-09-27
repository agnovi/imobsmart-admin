<script lang="ts" setup>

import type { IDadosprim } from '@/types/property'
const mainData = defineModel<IDadosprim>({
  required: true,
  default: {}
})
</script>
<template>
  <section>
    <h4 class="text-xl font-semibold text-gray-700 mb-4">Informações Principais</h4>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <base-input v-model="mainData.reference" label="Referência" />
      <base-input v-model="mainData.sale" is-money label="Oferta" />
      <base-input v-model="mainData.sale_valuation" is-money label="Valor na Avaliação de venda" />
      <base-input v-model="mainData.rental_evaluation" is-money label="Valor Aluguel" />
      <base-input v-model="mainData.condominium" is-money label="Valor Condominio" />
      <base-input label="&nbsp;">
        <base-checkbox v-model="mainData.leased" label="Área de Lazer" />
      </base-input>
      <base-input
        v-model="mainData.accommodates_how_many_people"
        type="number"
        min="0"
        label="Acomoda quantas pessoas"
      />
      <base-input v-model="mainData.type_of_rental" label="Tipo de aluguel" />
      <base-input v-model="mainData.dt_evaluatio" type="date" label="Data da avaliação" />
      <base-input
        v-model="mainData.useful_built_area"
        type="number"
        min="0"
        label="Área Contruída Útil (m²)"
      />
      <base-input v-model="mainData.common_area" type="number" min="0" label="Área Comum (m²)" />
      <base-input v-model="mainData.private_area" type="number" min="0" label="Área Privada (m²)" />
      <base-input
        v-model="mainData.total_land_area"
        type="number"
        min="0"
        label="Área Total (m²)"
      />
      <base-input v-model="mainData.go_free" type="number" min="0" label="go_free" />
      <base-input label="&nbsp;">
        <base-checkbox v-model="mainData.auth_to_negotiate" label="Autorização para negociar" />
      </base-input>
      <base-input v-model="mainData.end_of_authorization" label="Fim da Autorização" />
      <base-input label="&nbsp;">
        <base-checkbox v-model="mainData.exclusive" label="Exclusividade" />
      </base-input>
      <base-input v-model="mainData.end_of_exclusive" label="Fim da exclusividade" />
      <base-input v-model="mainData.registered_by" label="Registrado Por" />
      <base-input v-model="mainData.alternative_reference" label="Referência Alternativa" />
      <base-input v-model="mainData.status" label="Status" is-slot>
        <base-select
          v-model="mainData.status"
          :options="[
            { label: 'Ativo', value: true },
            { label: 'Inativo', value: false }
          ]"
        />
      </base-input>
      <base-input v-model="mainData.type" label="Tipo" />
      <base-input v-model="mainData.purpose" label="Propósito" />
      <base-input v-model="mainData.name" label="Nome" />
      <base-input v-model="mainData.standard" label="Padrão" />
      <base-input v-model="mainData.zoning" label="Zoneamento" />
      <base-input label="&nbsp;">
        <base-checkbox v-model="mainData.gated_condominium" label="Condomínio Fechado" />
      </base-input>
      <base-input v-model="mainData.default_location" label="Localização Padrão" />
      <base-input v-model="mainData.IPTU_value" label="Valor IPTU" />
      <base-input
        v-model="mainData.year_construction"
        type="number"
        min="0"
        label="Ano de Construção"
      />
      <base-input v-model="mainData.reform_year" type="number" min="0" label="Ano de Reforma" />
      <base-input label="&nbsp;">
        <base-checkbox
          v-model="mainData.used_FGTS_in_the_last_3_years"
          label="Usou FGTS nos Últimos 3 Anos"
        />
      </base-input>
      <base-input label="&nbsp;">
        <base-checkbox v-model="mainData.accept_exchange" label="Aceita Troca" />
      </base-input>
      <base-input label="&nbsp;">
        <base-checkbox v-model="mainData.accept_financing" label="Aceita Financiamento" />
      </base-input>
      <base-input v-model="mainData.situation" label="Situação" />
      <base-input v-model="mainData.needs_renovation" label="Precisa de reforma" />
      <base-input
        v-model="mainData.rental_guarantee_accepted_by_the_owner"
        label="Garantia de aluguel aceita"
      />
      <base-input v-model="mainData.internal_comments" label="Comentário Interno" />
      <base-input v-model="mainData.commercial_condition" label="Condição Comercial" />
      <base-input v-model="mainData.nearby_meters" label="Medidores Próximos" />
      <base-input v-model="mainData.pickup" label="Captador" />
      <base-input v-model="mainData.files" label="Arquivos" />
      <base-input
        v-model="mainData.pass_on_promotion_payment_conditions"
        label="Condições Pagamento"
      />
      <base-input
        v-model="mainData.method_of_paying_the_outstanding_balance"
        label="Método Pagamento Saldo Pendente"
      />
    </div>
  </section>
</template>
