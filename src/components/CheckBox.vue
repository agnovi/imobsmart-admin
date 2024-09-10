<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    label?: string
    onChange: () => void
  }>(),
  {
    modelValue: false,
    onChange: () => {}
  }
)
const id = `checkbox-${Math.random().toString(36).substr(2, 9)}`
const value = defineModel()
</script>

<template>
  <div class="flex items-center">
    <input
      v-model="value"
      :id="id"
      type="checkbox"
      class="form-checkbox h-5 w-5 text-primary-500"
      @change="onChange"
    />
    <label v-if="label" :for="id" class="ml-2 block text-sm">
      {{ label }}
    </label>
  </div>
</template>
