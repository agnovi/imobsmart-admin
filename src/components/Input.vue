<template>
  <div class="w-full relative ">
    <Field v-slot="{ field, errorMessage }" v-model="value" :name="name ? name : `${cryptoName}-${name}`"
      :rules="rules">
      <label v-if="label" :for="props.id || props.name"
        :class="`${!!errorMessage ? 'text-red-700' : 'text-gray-700'} text-[14px] mb-1 block`">{{ label }}</label>
      <div class="relative w-full flex items-center transition-all border" :class="[
        ` ${disabled ? 'bg-gray-100' : ''} ${padding ? padding : noPaddingPX ? 'px-0' : !isSlot ? 'px-0' : 'px-0'} rounded-[8px]`,
        {
          'bg-red-50': !!errorMessage,
          'bg-gray-50': !errorMessage && !isSlot && $route.meta.external,
          wrapper: (!errorMessage && !isSlot) || $route.meta.external,
          'border border-[#d2d3d4]': isSlot,
          'pl-6' : prependIcon || $slots.preppend,
        },
         {
                'border-[#d2d3d4]': !errorMessage && !isSlot,
                'border-red-500': !!errorMessage
              }
      ]">
        <div v-if="prependIcon || $slots.preppend" class="absolute left-2 top-3">
          <slot name="preppend" class="mr-[2px]">
            <i :class="prependIcon" class="text-gray-500 text-sm"></i>
          </slot>
        </div>
        <slot v-bind="field">
          <Money3Component v-if="isMoney" :id="props.id || props.name" v-model.number="value" v-bind="configMoney" class="border-0 bg-transparent outlined-0" style="box-shadow: none" :class="[
            disabled
              ? ' bg-dark flex-1 p-2 outline-0 text-md w-full rounded-md placeholder:text-[#D6D6D6]'
              : 'flex-1 p-2 outline-0 text-md w-full rounded-md placeholder:text-[#D6D6D6]',
          ]" @input="(e: any) => {
             emit('input');
             handleBlank(e);
             }" />

          <input v-else :id="props.id || props.name" :aria-label="props.name" v-maska :data-maska="mask" :type="type"
            v-bind="field" :placeholder="placeholder" class="border-0 bg-transparent outlined-0" style="box-shadow: none" :class="[
              disabled
                ? ' bg-dark flex-1 p-2 outline-0 text-md w-full rounded-md placeholder:text-[#D6D6D6]'
                : 'flex-1 p-2 outline-0 text-md w-full rounded-md placeholder:text-[#D6D6D6]',
             
            ]" :disabled="disabled" :min="min" :minLength="minLength" @maska="onMaska" @blur="emit('blur')" />
        </slot>
        <div v-if="appendIcon || $slots.append">
          <slot name="append" class="mr-[2px]">
            <i :class="appendIcon" class="text-gray-500 text-sm"></i>
          </slot>
        </div>
        
        <div v-if="loading" class="absolute right-0">
          <LSpinner :color="'secondary'" />
        </div>
      </div>
      <div class="w-full left-0 bottom-[-18px] text-center empty:hidden">
          <p v-if="errorMessage" class="text-xs text-red-500 text-left">
            {{ errorMessage ? errorMessage : 'Campo obrigatório' }}
          </p>
        </div>
    </Field>
    <slot name="infoBlock" />
  </div>
</template>
<script lang="ts" setup>
import { vMaska } from 'maska'
import { Money3Component } from 'v-money3'
import { Field, defineRule } from 'vee-validate'
import LSpinner from './Spinner.vue'
import * as validations from '../util/validators'
import { computed } from 'vue'
import { reactive } from 'vue'
import { onMounted } from 'vue'

const objValid: any = validations
// type Rules = keyof typeof validations

Object.keys(objValid).forEach((x: string) => {
  defineRule(x, objValid[x])
})

const props = withDefaults(defineProps<IProps>(), {
  type: 'text',
  mask: '',
  placeholder: '',
  isSlot: false,
  noPaddingPX: false
})

interface IProps {
  type?: string
  mask?: string
  id?: string
  label?: string
  name?: string
  placeholder?: string
  padding?: string
  rules?: string
  loading?: boolean
  isMoney?: boolean
  disabled?: boolean
  noPaddingPX?: boolean
  isSlot?: boolean
  prependIcon?: string
  appendIcon?: string
  min?: string | number
  max?: string | number
  minLength?: string | number
}

interface MaskaDetail {
  masked: string
  unmasked: string
  completed: boolean
}
const emit = defineEmits(['maskaComplete', 'blur', 'input'])

const configMoney = reactive({
  masked: false,
  prefix: 'R$',
  suffix: '',
  thousands: '.',
  decimal: ',',
  precision: 2,
  disableNegative: false,
  disabled: false,
  allowBlank: true,
  shouldRound: true,
  focusOnRight: false
})
const value = defineModel<any>()

const onMaska = (event: CustomEvent<MaskaDetail>) => {
  if (event.detail.completed) {
    emit('maskaComplete', event.detail.unmasked)
  }
}

function handleBlank(e:any) {
  if (e.data == '0' && !value.value) {
    configMoney.allowBlank = false
    value.value = 0
  } else if (e.data === null) {
    configMoney.allowBlank = true
    setTimeout(() => {
      value.value = ''
    }, 100);
  }
}

const cryptoName = computed(() => {
  return self.crypto.randomUUID()
})

onMounted(() => {
  if (props.isMoney && !value.value) {
    value.value = ''
  }
})
</script>

<style lang="scss" scoped>
/*.wrapper:has(input:focus) {
  @apply border border-primary-600;
}*/

input:disabled {
  cursor: not-allowed;
}

.bg-dark {
  background-color: #d4d4d4;
}
</style>
