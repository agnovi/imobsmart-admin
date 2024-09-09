<template>
    <div class="flex border rounded-lg p-4 ">
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="{'text-blue-500 [&>div]:border [&>div]:border-[#4F46E5]': currentStep >= index + 1, 'text-gray-500 [&>div]:border [&>div]:border-gray-500': currentStep < index + 1}"
        class="flex items-center"
      >
        <div class="w-8 h-8 flex items-center justify-center rounded-full ">
          {{ index + 1 }}
        </div>
        <span class="ml-2">{{ step }}</span>
        <IChevronDoubleRight v-if="index < steps.length - 1" class="w-4 h-4 mx-3" :color="currentStep > index + 1 ? '#4F46E5' : ''" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue'
  import IChevronDoubleRight from './icones/IChevronDoubleRight.vue';
  
  const props = defineProps({
    steps: {
      type: Array,
      required: true
    },
    currentStep: {
      type: Number,
      required: true
    }
  })
  </script>