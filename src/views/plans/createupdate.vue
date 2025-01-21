<template>
    <div>
        <FullSpinner v-if="loadingData" />
        <div class="flex justify-between mb-3">
            <h3 class="text-3xl font-medium text-gray-700">
                {{ !route?.params.id ? 'Novo Plano' : 'Editar PLano' }}
            </h3>
            <button class="border border-gray-600 rounded px-2 text-md" @click="$router.go(-1)">
                Voltar
            </button>
        </div>
        <CardForm>
            <template #content>

                <Form @submit="handleSubmit">

                    <div class="w-full flex gap-4 justify-end items-end ">
                        <div class="flex flex-col items-end">
                            <label>Promoção</label>
                            <input type="checkbox" v-model="data.is_promotion" class="peer sr-only opacity-0 mt-2"
                                id="togglePromocao" />
                            <label for="togglePromocao"
                                class="relative  mt-2 flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 outline-gray-400 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-green-500 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400 peer-checked:peer-focus-visible:outline-green-500">
                                <span class="sr-only">Enable</span>
                            </label>
                        </div>
                        <div class="flex flex-col items-end">
                            <label>Empresarial</label>
                            <input type="checkbox" v-model="data.is_company" class="peer sr-only opacity-0 mt-2"
                                id="toggle" />
                            <label for="toggle"
                                class="relative  mt-2 flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 outline-gray-400 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-green-500 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400 peer-checked:peer-focus-visible:outline-green-500">
                                <span class="sr-only">Enable</span>
                            </label>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                        <base-input v-model="data.name" type="text" label="Nome do plano" rules="required" />

                        <div class="flex-1 w-full">
                            <base-input v-model="data.status" label="Status" is-slot>
                                <base-select v-model="data.status" :options="status" />
                            </base-input>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                        <base-input v-model="data.value_total" is-money
                            :label="`Valor do plano ${data.is_promotion ? 'com desconto' : ''}`" min="0" />
                        <base-input v-model="data.parcel" label="Tipo de negociação" is-slot>
                            <base-select v-model="data.parcel" :options="ciclos" />
                        </base-input>
                    </div>
                    <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                        <base-input v-if="data.is_company" v-model="data.qtd_user" type="number"
                            label="Quantidade de usuário" min="0" />
                        <base-input v-if="data.is_promotion" v-model="data.value_without_discount" is-money
                            label="Valor do plano sem desconto" min="0" />
                    </div>
                    <div class="flex justify-end mt-8">
                        <base-button type="submit" :disabled="loading" :loading="loading" class="max-w-fit">
                            <ISave />
                            Salvar Alterações
                        </base-button>
                    </div>
                </Form>
            </template>
        </CardForm>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Form } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import CardForm from '../../components/CardForm.vue';
import ISave from '../../components/icones/ISave.vue';
import { http } from '../../api/api';
import { useToast } from 'vue-toastification';
import FullSpinner from '../../components/FullSpinner.vue';

const toast = useToast()
const route = useRoute()
const router = useRouter()
const ciclos = ref([])
const status = ref([{ label: 'ATIVO', value: 1 }, { label: 'INATIVO', value: 0 }])
const data = ref({
    name: '',
    value_total: 0,
    is_company: false,
    parcel: 'MONTHLY',
    status: 1,
    qtd_user: 0,
    is_promotion: false,
    value_without_discount: 0
})
const loading = ref(false)
const loadingData = ref(false)

onMounted(() => {
    listTypes()
    if (route.params.id) {
        getIdPlan()
    }
})

const listTypes = async () => {
    try {
        const res = await http.get('/plans/list-type')
        ciclos.value = res.data.data
    } catch (error) {
        console.log(error)
    }
}

const getIdPlan = async () => {
    loadingData.value = true
    try {
        const res = await http.get(`/plans/${route.params.id}`)
        data.value.name = res.data.name
        data.value.value_total = res.data.value_total
        data.value.is_company = res.data.is_company === 0 ? false : true
        data.value.parcel = res.data.parcel.value
        data.value.status = res.data.status
        data.value.qtd_user = res.data.qtd_user
        data.value.is_promotion = res.data.is_promotion === 1 ? true : false,
            data.value.value_without_discount = res.data.is_promotion === 1 ? res.data.value_without_discount : 0
    } catch (error) {
        console.log(error)
    } finally {
        loadingData.value = false
    }
}

const handleSubmit = async () => {
    loading.value = true
    try {
        const dataPlan = {
            name: data.value.name,
            value_total: data.value.value_total,
            is_company: data.value.is_company,
            parcel: data.value.parcel,
            status: data.value.status,
            qtd_user: data.value.is_company === false ? 1 : data.value.qtd_user,
            is_promotion: data.value.is_promotion,
            value_without_discount: data.value.is_promotion ? data.value.value_without_discount : 0
        }
        if (route.params.id) {
            await http.patch(`/plans/${route.params.id}`, dataPlan)
        } else {
            await http.post('/plans', dataPlan)
        }

        toast.success('Plano salvo com sucesso')
        router.push('/planos')
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}
</script>

<style scoped></style>