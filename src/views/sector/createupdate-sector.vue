<script lang="ts" setup>
import { Form } from 'vee-validate'

import Input from '@/components/Input.vue'
import ISave from '../../components/icones/ISave.vue'
import * as SectorServices from '@/api/services/SectorServices'


import { onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import FullSpinner from '@/components/FullSpinner.vue'
import useAuth from '@/composables/useSession'
const { token } = useAuth()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const data = reactive({
    id: '',
    name: '',
    level: '',
})
const loading = ref(false)
const loadingSave = ref(false)

onMounted(() => {
    if (token.value) {
        if (route.fullPath === `/editar-setor/${route.params.id}`) getRoleById()
    }
})

async function getRoleById() {
    loading.value = true
    try {
        const c = await SectorServices.get(route.params.id)
        data.name = c?.data?.name
        data.id = c?.data.id

    } catch (error) {
        loading.value = false
    } finally {
        loading.value = false
    }
}

async function onsubmit() {

    loadingSave.value = true
    try {
        if (route?.fullPath === '/adicionar-setor') {
            await SectorServices.create({
                name: data.name,
            })
        } else {
            await SectorServices.edit({
                name: data.name,
            }, route.params.id)
        }


        toast.success('Setor salva com sucesso')
        router.back()
    } catch (error) {
        toast.error('Erro ao salvar a setor')
    } finally {
        loadingSave.value = false
    }

}
</script>

<template>
    <div class="mt-4">
        <FullSpinner v-if="loading" />
        <div class="flex justify-between mb-3">
            <h3 class="text-3xl font-medium text-gray-700">{{ route?.fullPath === '/adicionar-setor' ? 'Nova Setor' :
                'Editar Setor' }}</h3>
            <button class="border border-gray-600 rounded px-2 text-md" @click="$router.go(-1)">Voltar</button>
        </div>
        <Form @submit="onsubmit" class="p-6 bg-white rounded-md shadow-md">
            <div class="w-[90%] lg:w-[60%] flex flex-col gap-5">
                <div class="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Input v-model="data.name" label="Nome*" rules="required" placeholder="Digite a razão social" />
                </div>
            </div>

            <div class="flex justify-end">
                <button :disabled="loadingSave" type="submit"
                    class="bg-[#4F46E5] py-3 px-4 flex items-center gap-3 rounded-md text-white" label="Criar setor">
                    <ISave />
                    Salvar setor
                    <spinner v-if="loadingSave" />
                </button>
            </div>
        </Form>
    </div>
</template>
