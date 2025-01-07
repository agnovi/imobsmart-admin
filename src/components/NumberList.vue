<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, withDefaults } from 'vue';

interface IProps {
    title: string;
    quantity: number;
}

const props = withDefaults(defineProps<IProps>(), {
    title: '',
    quantity: 0
});


const emit = defineEmits(['update:modelValue']);


const selected = defineModel<number[]>({
    required: true,
    default: []
});

function handleSelect(n: number) {
if(selected.value.includes(n)) {
    selected.value = selected.value.filter((item: number) => item !== n);
    return;
} else {
    selected.value.push(n);
    return;
}
}

watch(() => selected.value, () => {
    emit('update:modelValue', selected.value);
});
</script>

<template>
    <div class="flex flex-col gap-1">
        <div class="flex gap-3">
            <div class="w-4 h-4">
                <slot name="icon"></slot>
            </div>
            <span class="text-sm">{{ props.title }}</span>
        </div>
        <div class="flex gap-2">
            <div v-for="n in (props.quantity >= 4 ? 3 : props.quantity)" :key="n">
                <button @click="handleSelect(n)" class="rounded-md w-11 h-11" :class="selected.includes(n) ? 'bg-primary-500 text-white' : 'border border-gray-300 text-gray-800'">
                    {{ n }}
                </button>
            </div>
            <div v-if="props.quantity >= 4">
                <button @click="handleSelect(4)" class="rounded-md w-11 h-11" :class="selected.includes(4) ? 'bg-primary-500 text-white' : 'border border-gray-300 text-gray-800'">
                    4+
                </button>
            </div>
        </div>
    </div>
</template>