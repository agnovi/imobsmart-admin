<script lang="ts" setup>
interface TabsProps {
  list: string[]
  active: string
}

const emit = defineEmits(['setTab'])

defineProps<TabsProps>()
</script>
<template>
  <div class="container mx-auto">
    <ul class="flex space-x-2 text-primary border-b border-b-primary">
      <li v-for="(item, index) in list" :key="index">
        <button
        :aria-label="item"
          @click.prevent.stop="emit('setTab', item)"
          class="inline-block px-6 py-4 focus:outline-none"
          :class="active === item ? 'font-semibold border-b-[2px] border-primary-500' : ''"
        >
          {{ item }}
        </button>
      </li>
    </ul>
    <div class="p-3 mt-6">
      <slot name="tabs-body"></slot>
    </div>
  </div>
</template>

