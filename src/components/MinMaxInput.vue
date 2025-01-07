<script setup lang="ts">
import { ref, watch } from 'vue';
interface IProps {
    label?: string;
    type?: string;
    bottomText?: string;
    preffix?: string;
    suffix?: string;
    maska?: string | object;
    isMoney?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
    label: 'Label',
    type: 'text',
    bottomText: '',
    preffix: '',
    suffix: '',
    maska: ''
});

const errorMsg = ref('');

const min = ref('');
const max = ref('');

const value = defineModel({
    required: true,
    default: { min: '', max: '' }
})

const emit = defineEmits(['update:modelValue']);

function validateRange() {
    if (min.value && max.value && Number(min.value.replace(/\D/g, '')) > Number(max.value.replace(/\D/g, ''))) {
        errorMsg.value = `Número deve estar entre ${min.value} e ${max.value}`;
    }

    else {
        console.log('else');
        errorMsg.value = '';
    }
}

watch(() => [value.value.min, value.value.max], () => {
    validateRange();
    // emit('update:modelValue', { min: min.value, max: max.value });
});
</script>

<template>
    <div class="flex flex-col">

            <label class="font-400 text-dark text-sm">{{ props.label
                }}</label>


        <div class="flex">
            <div>
                <base-input v-model="value.min" name="min" :type="props.type" :maska="maska" :isMoney="isMoney" :whithPrefixMoney="false" class="rounded-r-none">
                    <template #icon v-if="props.preffix">
                        <p class="text-sm">
                            {{ props.preffix || '' }}
                        </p>
                    </template>
                    <template #suffix v-if="props.suffix">
                        <p class="text-sm">
                            {{ props.suffix }}
                        </p>
                    </template>
                </base-input>
                <p class="text-sm"> {{ props.bottomText }} min.</p>

            </div>
            <div>
                <base-input v-model="value.max" name="max" :type="props.type" :maska="maska" :isMoney="isMoney" :whithPrefixMoney="false" class="rounded-l-none">
                    <template #icon v-if="props.preffix">
                        <p class="text-sm">
                            {{ props.preffix || '' }}
                        </p>
                    </template>
                    <template #suffix v-if="props.suffix">
                        <p class="text-sm">
                            {{ props.suffix }}
                        </p>
                    </template>
                </base-input>
                <span class="flex justify-end text-sm"> {{ props.bottomText }} max.</span>
            </div>
        </div>
                    <span class="text-red-500 text-sm">{{ errorMsg }}</span>
    </div>
</template>