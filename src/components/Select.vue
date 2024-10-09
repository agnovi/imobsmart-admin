<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    label?: string;
    options?: { label: string; value: any }[];
    multiple?: boolean;
    placeholder?: string;
  }>(),
  {
    multiple: false,
  }
);

const inputValue = defineModel<any>();
</script>

<template>
  <div class="flex flex-col gap-1 w-full ">
    <label v-if="props.label" class="text-gray-700 text-[14px] ">{{
      props.label
    }}</label>
    <v-select v-model="inputValue" :multiple="multiple" :placeholder="placeholder || 'Selecionar'"
      :options="props.options || []" :reduce="(opt: any) => opt.value"
      class="text-sm border border-[#d2d3d4] rounded-md" />
    <div v-if="multiple" class="flex flex-wrap gap-1 mt-1.5">
      <div v-for="option in inputValue" :key="option.value" class="bg-gray-200 flex rounded-full text-sm px-2 py-1">
        {{ option.label }}
        <button v-if="multiple" @click="inputValue.splice(inputValue.indexOf(option), 1)" class="ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <button v-if="inputValue.length > 0" @click="inputValue = []" class="ml-1 underline text-sm">
        Limpar
      </button>
    </div>
  </div>
</template>
