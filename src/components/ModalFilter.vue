<template>
    <Teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
            <div class="fixed inset-0 bg-black opacity-50"></div>
            <div class="bg-[#fff] overflow-hidden md:max-w-[100rem] relative z-10 w-full min-h-screen md:min-h-fit md:w-auto md:h-auto md:rounded-lg">
                <div class="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 class="text-lg font-medium">{{ props.title }}</h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="p-6 overflow-y-auto max-h-[calc(100vh-10rem)]">
                    <slot></slot>
                </div>
                <div class="px-6 py-4 border-t border-gray-200 flex justify-center items-center gap-2">

                    <slot name="actions">
                        <Button size="lg" @click="confirmAction">{{ props.confirmText }}</Button>
                        <Button variant="outlined" textColor="text-primary-950" size="lg" @click="closeModal">{{ props.cancelText }}</Button>
                    </slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import Button from '@/components/Button.vue';
interface IProps {
    title: string;
    isOpen: boolean;
    confirmText?: string;
    cancelText?: string;
}

const props = defineProps<IProps>();
const emit = defineEmits(['close', 'confirm']);

const closeModal = () => {
    emit('close');
};

const confirmAction = () => {
    emit('confirm');
};
</script>

<style scoped>
/* Adicione estilos adicionais aqui, se necessário */
</style>