<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    placeholder?: string
    rows?: string
    onChange: () => void
  }>(),
  {
    onChange: () => {},
    rows: '8'
  }
)
const value = defineModel('')
</script>

<template>
    <textarea
      v-model="value"
      :rows="rows"
      class="block w-full bg-white border-0 outline-none focus:ring-0 rounded-lg"
      :placeholder="placeholder"
    >
    </textarea>
</template>
