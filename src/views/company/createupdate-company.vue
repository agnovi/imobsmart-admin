<script lang="ts" setup>
import { Form } from 'vee-validate'

import Input from '@/components/Input.vue'
import ISave from '../../components/icones/ISave.vue'
import * as companyService from '@/api/services/PropertyService'
import { onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import { customFilter, removerMascaraCNPJ, validarCNPJ } from '@/util/helpers'
import useAuth from '@/composables/useSession'
import { http } from '@/api/api'
import { importImage } from '@/api/services/ImportImage'
const { token } = useAuth()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const data = reactive<any>({
    name: '',
    cnpj: '',
    networkId: 0,
    logo: '',
    clustertypes: [],
    roles: [],
    addresses: [
        {
            cep: '',
            street: '',
            state: '',
            city: '',
            country: '',
            number: '',
            complement: ''
        }
    ]
})
const networks = ref([])
const loading = ref(false)
const loadingSave = ref(false)
const loadingUpload = ref(false)
const listClusters = ref<any[]>([])


onMounted(() => {
    if (token.value) {
        if (route.fullPath === `/editar-empresa/${route.params.id}`) getCompanyById()
    }
})

async function getCompanyById() {
    loading.value = true
    try {
        const c = await companyService.getCompany(route.params.id)
        data.name = c?.data?.name
        data.cnpj = c?.data.cnpj
        data.networkId = c?.data.networkCompanyId
        data.logo = c?.data.logo
        data.clustertypes = c?.data.clusters
            ? c?.data.clusters.map((r: any) => r.cluster_types_id)
            : [],
            data.addresses[0].cep = c.data?.address[0].cep
        data.addresses[0].complement = c.data?.address[0].complement
        data.addresses[0].street = c.data?.address[0].street
        data.addresses[0].state = c.data?.address[0].state
        data.addresses[0].number = c.data?.address[0].number
        data.addresses[0].city = c.data?.address[0].city
    } catch (error) {
        loading.value = false
    } finally {
        loading.value = false
    }
}

const isImage = (file: any) => {
    return file.type.startsWith('image/')
}

async function onChangeFile(e: any) {
    const file = e.target.files[0]

    if (!isImage(file)) {
        toast.error('O arquivo selecionado não é uma imagem')
        return
    }

    try {
        loadingUpload.value = true
        const res = await importImage(file, 'image')
        const url = res.data
        data.logo = url
    } catch (error) {
        toast.error('Erro ao realizar upload')
    } finally {
        loadingUpload.value = false
    }
}

async function onsubmit() {
    if (!data.networkId) {
        toast.error('Selecione qual rede a empresa pertence ')
        return
    }

    if (validarCNPJ(data.cnpj)) {
        loadingSave.value = true
        try {
            if (route?.fullPath === '/adicionar-empresa') {
                await companyService.createCompany({
                    name: data.name,
                    cnpj: removerMascaraCNPJ(data.cnpj),
                    addresses: data.addresses,
                    networkId: data.networkId,
                    logo: data.logo,
                    clustertypes: data.clustertypes,

                })
            } else {
                await companyService.editCompany(
                    {
                        name: data.name,
                        cnpj: removerMascaraCNPJ(data.cnpj),
                        addresses: data.addresses,
                        networkId: data.networkId,
                        logo: data.logo,
                        clustertypes: data.clustertypes,

                    },
                    route.params.id
                )
            }

            toast.success('Empresa salva com sucesso')
            router.back()
        } catch (error) {
            toast.error('Erro ao salvar a tabela')
        } finally {
            loadingSave.value = false
        }
    } else {
        toast.error('CNPJ inválido')
    }
}

function capitalizeFirstLetter(text: string): string {
    if (!text) return text // Verifica se a string não está vazia
    return text.charAt(0).toUpperCase() + text.slice(1)
}

const checkedItem = (item: any, value: any) => {
    const index: any = value.indexOf(item?.id)
    if (index !== -1) {
        value.splice(index, 1)
    } else {
        value.push(item.id)
    }
}
</script>

<template>
    <div class="mt-4">
        <FullSpinner v-if="loading" />
        <div class="flex justify-between mb-3">
            <h3 class="text-3xl font-medium text-gray-700">
                {{ route?.fullPath === '/adicionar-empresa' ? 'Nova Empresa' : 'Editar Empresa' }}
            </h3>
            <button class="border border-gray-600 rounded px-2 text-md" @click="$router.go(-1)">
                Voltar
            </button>
        </div>
        <Form @submit="onsubmit" class="p-6 bg-white rounded-md shadow-md">
            <div>
            <base-input label=""></base-input>
            </div>

            <div class="flex justify-end">
                <button :disabled="loadingSave" type="submit"
                    class="bg-[#4F46E5] py-3 px-4 flex items-center gap-3 rounded-md text-white" label="Criar empresa">
                    <ISave />
                    Salvar empresa
                    <spinner v-if="loadingSave" />
                </button>
            </div>
        </Form>
    </div>
</template>
