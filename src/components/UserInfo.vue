<template>
    <div class="flex items-center">
        <div class="w-12 h-12 bg-gray-200 rounded-full font-bold flex items-center justify-center">
            {{ props.name?.split(' ')[0][0] }}{{ props.name?.split(' ')[1][0] }}
        </div>
        <div class="ml-4">
            <div class="text-sm font-medium text-gray-700">{{ props.name }}</div>
            <div class="text-xs text-gray-500">{{ props.role }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">

interface IProps {
    name: string
    role: string
}

const props = defineProps<IProps>()
</script>

<style scoped></style>