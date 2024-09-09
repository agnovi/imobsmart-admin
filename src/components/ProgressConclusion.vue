<template>
    <div>
        <p class="text-sm font-bold mb-1 text-[#19224D]">{{props.label || 'PROGRESSO DE CONCLUSÃO DOS TREINAMENTOS'}}</p>
        <div class="flex justify-between mb-1">
        </div>

        <div class="w-full h-2 bg-gray-200 rounded-full">
            <div class="h-full bg-[#44C8F5] rounded-full" :style="{ width: `${props.progress}%` }"></div>
            <p class="text-xs text-gray-500 text-right mt-1">{{String(props.progress).split('.')[0]}}% concluído</p>
            
        </div>
    </div>
</template>

<script setup lang="ts">
interface IProps {
    progress: number
    label?: string
}

const props = defineProps<IProps>()

</script>

<style scoped></style>