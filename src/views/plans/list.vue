<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import Table from '../../components/Table.vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { formatToBRL } from '../../util/helpers'
import { useDebounceFn } from '@vueuse/core'
import useAuth from '../../composables/useSession'
import { http } from '../../api/api'
const { token } = useAuth()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const plans = ref<any[]>()

const pagination = reactive({
    page: 1,
    limit: 10,
    total: 0
})
const columns = ref([
    {
        label: 'Nome',
        key: 'nome'
    },
    {
        label: 'Empresarial',
        key: 'empresarial'
    },
    {
        label: 'Ciclo',
        key: 'ciclo',

    },
    {
        label: 'Valor',
        key: 'valor',
        custom: true
    },
    {
        label: 'Desconto',
        key: 'desconto',

    },
    {
        label: 'Valor com desconto',
        key: 'valorComDesconto',

    },
    {
        label: 'Porcentagem',
        key: 'porcentagem',

    },
    {
        label: 'Status',
        key: 'status',
        custom: true
    },
    {
        label: '',
        key: 'actions'
    }
])

onMounted(() => {
    if (token.value) listItems()
})
const search = ref<string>('')
watch(
    () => search.value,
    () => {
        debouncedFn()
    }
)
watch(
    () => pagination.page,
    () => {
        listItems()
    },
    { deep: true }
)
watch(
    () => pagination.limit,
    () => {
        listItems()
    },
    { deep: true }
)


async function listItems() {
    loading.value = true
    try {
        const res = await http.get(`/plans?page=${pagination.page}&limit=${pagination.limit}${search.value ? `&search=${search.value}` : ''}`)
        pagination.total = res.data?.pagination?.totalQuantity

        const teste = res.data?.rows.map((plan: any) => {
            return {
                id: plan.id_plan,
                nome: plan.name,
                empresarial: plan.is_company === 1 ? 'Sim' : 'Não',
                ciclo: plan.parcel?.name,
                valor: plan.is_promotion === 1 ? plan.value_without_discount : plan.value_total,
                status: plan.status === 1 ? 'ATIVO' : 'INATIVO',
                desconto: plan.is_promotion === 1 ? 'Sim' : 'Não',
                valorComDesconto: plan.is_promotion === 1 ? plan.value_total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }) : 'R$ 0,00',
                porcentagem: `${parseFloat(plan.percent).toFixed(2)}%`,
            }
        })


        plans.value = teste
    } catch (error) {
        loading.value = false
    } finally {
        loading.value = false
    }
}

const debouncedFn = useDebounceFn(() => {
    listItems()
}, 1000, { maxWait: 5000 })

function handleAdd() {
    router.push('/adicionar-planos')
}

async function handleEditedit(item: any) {
    router.push(`/editar-planos/${item.id}`)
}



async function removeUser(item: any) {
    Swal.fire({
        title: '<strong>Atenção</strong>',
        icon: 'question',
        html: `Deseja realmente deletar  ${item.nome}`,
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: `Não`
    }).then(async (result: any) => {
        if (result.isConfirmed) {
            try {
                await http.delete(`/plans/${item.id}`)
                toast.success('Plano deletado com sucesso')
                listItems()
            } catch (error) {
                console.log(error)
            }
        }
    })
}


</script>

<template>
    <div>
        <h3 class="text-3xl font-medium text-gray-700">Planos</h3>
        <Table :loading="loading" :columns="columns" :rows="plans" :total-page="pagination.total"
            :current-page="pagination.page" :items-per-page="pagination.limit" :filter-default="true"
            @edit-item="handleEditedit" @delete-item="removeUser" @remove-search="search = ''"
            @changePerPage="pagination.limit = $event" @changePage="pagination.page = $event" @search="search = $event">
            <template #BtnTable>
                <div class="flex justify-end">
                    <button class="btn-primary mx-2" @click="handleAdd">Adicionar planos</button>
                </div>
            </template>
            <template #valor="{ row }">
                <p>{{ formatToBRL(Number(row.valor)) }}</p>
            </template>

            <template #status="{ row }">
                <div v-if="row.status === 'ATIVO'" class="text-[#10B981] text-center bg-[#D1FAE5] rounded-full py-1">
                    <span>Ativo</span>
                </div>

                <div v-else-if="row.status === 'INATIVO'"
                    class="text-[#C53030] text-center bg-[#FEE2E2] rounded-full py-1">
                    <span>Inativo</span>
                </div>

            </template>

        </Table>
    </div>
</template>

<style scoped>
.btn-primary {
    background-color: #4f46e5;
    color: #ffffff;
    font-size: 14px;
    padding: 8px;
    gap: 10px;
    width: Hug (156px);
    height: Hug (36px);
    border-radius: 6px;
}

.btn-saved {
    background-color: #4f46e5;
    color: #ffffff;
    font-size: 14px;
    padding: 16px 50px 16px 50px;
    gap: 10px;
    width: Hug (156px);
    height: Hug (36px);
    border-radius: 6px;
}

.btn-primary:hover {
    background-color: #3630a8;
}

.btn-import {
    background-color: #f9fafb;
    color: #354052;
    font-size: 14px;
    padding: 8px;
    gap: 10px;
    width: Hug (156px);
    height: Hug (36px);
    border-radius: 6px;
}

.btn-import:hover {
    background-color: #cfcfcf;
}
</style>
