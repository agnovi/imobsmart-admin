<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    size?: string
    color: string
  }>(),
  {
    size: '24',
    color: '#00BCCB'
  }
)
</script>
<template>
  <svg
    aria-label="currently running: "
    :width="size"
    :height="size"
    fill="none"
    viewBox="0 0 16 16"
    class="animate-spin"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="none"
      :stroke="color"
      stroke-width="2"
      d="M3.05 3.05a7 7 0 1 1 9.9 9.9 7 7 0 0 1-9.9-9.9Z"
      opacity=".5"
    ></path>
    <path
      :fill="color"
      fill-rule="evenodd"
      d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
      clip-rule="evenodd"
    ></path>
    <path :fill="color" d="M14 8a6 6 0 0 0-6-6V0a8 8 0 0 1 8 8h-2Z"></path>
  </svg>
</template>
