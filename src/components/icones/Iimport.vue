<script lang="ts" setup>
const props = defineProps({
  color: { type: String, default: '#354052' },
  width: { type: Number, default: 16 },
  height: { type: Number, default: 14 }
})
</script>

<template>


<svg :width="width" :height="height" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 12.25H14V7H15.5V13C15.5 13.4142 15.1642 13.75 14.75 13.75H1.25C0.83579 13.75 0.5 13.4142 0.5 13V7H2V12.25ZM8.75 4.75V10H7.25V4.75H3.5L8 0.25L12.5 4.75H8.75Z" fill="#354052"/>
</svg>

</template>
