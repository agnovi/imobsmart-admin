<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  bgColor?: string
  textColor?: string
}>()
const emit = defineEmits(['click'])
const bgItem = computed(() => {
  return props.bgColor || 'bg-indigo-600'
})
const textColorItem = computed(() => {
  return props.textColor || 'text-white'
})
</script>

<template>
  <button
    type="submit"
    :disabled="disabled"
    :class="`${bgItem} ${textColorItem} flex items-center gap-3 w-full px-4 py-2 text-sm text-center rounded-md focus:outline-none opacity-[.9] shadow-xl hover:opacity-[1] hover:translate-y-[1px] transition-all`"
    @click="emit('click')"
  >
    <slot />
    <LoadingGit v-if="loading" />
  </button>
</template>
