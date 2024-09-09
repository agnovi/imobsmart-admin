<script lang="ts" setup>
import { Form } from 'vee-validate'

import Input from '@/components/Input.vue'
import ISave from '../../components/icones/ISave.vue'
import * as RoleServices from '@/api/services/RoleServices'

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
    level: {
        label: '',
        value: ''
    }
})
const loading = ref(false)
const loadingSave = ref(false)

onMounted(() => {
    if (token.value) {
        if (route.fullPath === `/editar-cargo/${route.params.id}`) getRoleById()
    }
})

async function getRoleById() {
    loading.value = true
    try {
        const c = await RoleServices.get(route.params.id)
        data.name = c?.data?.name
        data.level = c?.data.level
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
        if (route?.fullPath === '/adicionar-cargo') {
            await RoleServices.create({
                name: data.name,
                level: data.level.value
            })
        } else {
            await RoleServices.edit({
                name: data.name,
                level: data.level.value
            }, route.params.id)
        }


        toast.success('Cargo salva com sucesso')
        router.back()
    } catch (error) {
        toast.error('Erro ao salvar a cargo')
    } finally {
        loadingSave.value = false
    }

}
</script>

<template>
    <div class="mt-4">
        <FullSpinner v-if="loading" />
        <div class="flex justify-between mb-3">
            <h3 class="text-3xl font-medium text-gray-700">{{ route?.fullPath === '/adicionar-cargo' ? 'Nova Cargo' :
                'Editar Cargo' }}</h3>
            <button class="border border-gray-600 rounded px-2 text-md" @click="$router.go(-1)">Voltar</button>
        </div>
        <Form @submit="onsubmit" class="p-6 bg-white rounded-md shadow-md">
            <div class="w-[90%] lg:w-[60%] flex flex-col gap-5">
                <div class="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Input v-model="data.name" label="Nome*" rules="required" placeholder="Digite o nome do cargo" />

                </div>
                <div class="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <base-input is-slot label="Level">
                        <v-select v-model="data.level" class="w-full" value="value" :options="[
                            { value: 1, label: '1' },
                            { value: 2, label: '2' },
                            { value: 3, label: '3' },
                            { value: 4, label: '4' },
                            { value: 5, label: '5' },
                        ]" />
                    </base-input>

                </div>
            </div>

            <div class="flex justify-end">
                <button :disabled="loadingSave" type="submit"
                    class="bg-[#4F46E5] py-3 px-4 flex items-center gap-3 rounded-md text-white" label="Criar cargo">
                    <ISave />
                    Salvar cargo
                    <spinner v-if="loadingSave" />
                </button>
            </div>
        </Form>
    </div>
</template>
