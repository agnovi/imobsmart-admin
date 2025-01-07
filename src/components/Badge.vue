<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string
  bgColor: string
  color: string
}>(), {
  text: '',
  bgColor: 'bg-blue-100',
  color: 'text-blue-800'
})
</script>
<template>
  <span
    :class="`${bgColor} ${color} text-sm font-medium me-2 px-2.5 py-0.5 rounded`"
    >{{text}}</span
  >
</template>
