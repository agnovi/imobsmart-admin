<template>
    <div>
        <div class="flex justify-between mb-3">
            <h3 class="text-3xl font-medium text-gray-700">
                Contrato
            </h3>

        </div>
        <CardForm>
            <template #content>
                <base-editor v-model="text" />

                <div class="flex justify-end mt-8">
                    <base-button @click="submit" type="button" :disabled="loading" :loading="loading" class="max-w-fit">
                        <ISave />
                        Salvar Alterações
                    </base-button>
                </div>
            </template>

        </CardForm>
    </div>
</template>

<script setup lang="ts">
import CardForm from '../../components/CardForm.vue';

import { onMounted } from "vue";

import { http } from '@/api/api'
import { ref } from "vue";
import { useToast } from 'vue-toastification';

const toast = useToast()
const text = ref('')
const id = ref(0)
const loading = ref(false)

onMounted(() => {
    getContratos()
})

async function getContratos() {

    try {
        const res = await http.get('contracts/')
        id.value = res.data.rows[0]?.id
        text.value = res.data.rows.length > 0 ? res.data.rows[0]?.text : ''

    } catch (error) {
        console.log(error)
    }
}

async function submit() {
    loading.value = true
    try {
        await http.patch(`contracts/${id.value}`, {
            text: text.value
        })
        toast.success('Contrato atualizado com sucesso')
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}
</script>

<style scoped></style>