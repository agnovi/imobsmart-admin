<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

interface CheckboxItem {
    label: string;
    checked: boolean;
}

interface IProps {
    items: CheckboxItem[];
    label: string;
}

const props = defineProps<IProps>();
const emit = defineEmits(['update:items']);

const handleCheckboxChange = (index: number) => {
    props.items[index].checked = !props.items[index].checked;
    emit('update:items', [...props.items]);
};
</script>

<template>
    <div>
        <div class="mb-3">
            <label class="font-400 text-dark text-sm">{{ props.label
            }}</label>
        </div>
    
        <div class="flex gap-6">
            <div v-for="(item, index) in props.items" :key="index" class="flex items-center mb-2">
                <input type="checkbox" :checked="item.checked" @change="handleCheckboxChange(index)" class="mr-2" />
                <label>{{ item.label }}</label>
            </div>
        </div>
    </div>
</template>