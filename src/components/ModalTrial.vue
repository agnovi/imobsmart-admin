<template>
    <div v-if="props.show"
        class="absolute z-[100] inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-10">
        <div class="bg-white shadow-md w-[90%] p-5 rounded-lg">
            <div class="flex justify-end">
                <button type="button" @click="() => {
                    index = 0
                    emits('onClose')
                }
                    ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-x">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6l-12 12" />
                        <path d="M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div>
                <h1 class="text-[#374151] text-center text-[22px] mb-2">
                    Selecione o tipo de conteúdo que deseja adicionar
                </h1>
                <p class="text-[#7C7C7C] text-center">
                    Adicione uma nova atividade ou reutilize alguma atividade já criada
                </p>
            </div>

            <div class="flex items-center justify-center mt-5">
                <button type="button" class="border-b px-3" :class="index === 0 ? 'text-[#4F46E5] border-[#4F46E5]' : 'text-[#9CA3AF] border-[#374151]'
                    " @click="index = 0">
                    Adicionar nova atividade
                </button>
                <button type="button" class="border-b px-3" :class="index === 1 ? 'text-[#4F46E5] border-[#4F46E5]' : 'text-[#9CA3AF] border-[#374151]'
                    " @click="index = 1">
                    Biblioteca de atividades
                </button>
            </div>

            <div class="flex items-center gap-3 justify-center mt-5" v-if="index === 0">
                <button type="button" @click="send('VIDEOS')"
                    class="border border-[#CACACA] rounded-xl w-[130px] h-[130px] flex flex-col items-center justify-center p-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-video">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path
                            d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
                        <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
                    </svg>
                    <p class="text-[#374151] font-500">Vídeos</p>
                </button>
                <button type="button" @click="send('QUIZZ')"
                    class="border border-[#CACACA] rounded-xl w-[130px] h-[130px] flex flex-col items-center justify-center p-5">
                    <img src="/quiz 1.png" alt="Quizz" class="w-[25px]" />
                    <p class="text-[#374151] font-500">Quizz</p>
                </button>
                <button Type="button" @click="send('GAME')"
                    class="border border-[#CACACA] rounded-xl w-[130px] h-[130px] flex flex-col items-center justify-center p-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="rgba(79,70,229,1)">
                        <path
                            d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z">
                        </path>
                    </svg>
                    <p class="text-[#374151] font-500">Jogo da
                        memória</p>
                </button>
                <button Type="button" @click="send('TEXTO')"
                    class="border border-[#CACACA] rounded-xl w-[130px] h-[130px] flex flex-col items-center justify-center p-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="rgba(79,70,229,1)">
                        <path
                            d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z">
                        </path>
                    </svg>
                    <p class="text-[#374151] font-500">Conteúdo textual</p>
                </button>
            </div>

            <div v-if="index === 1" class="flex items-center justify-center">
                <div class="my-5 w-[50%]">
                    <table class="items-center w-full bg-transparent border-collapse">
                        <thead>
                            <tr>
                                <th
                                    class="px-4 rounded-tl-md bg-[#EEEE] text-[#6B7280] py-3 text-[13px] font-400 text-left uppercase border-l-0 border-r-0 whitespace-nowrap">
                                    Name
                                </th>

                                <th
                                    class="px-4 bg-[#EEEE] text-[#6B7280] font-400 align-middle py-3 text-[13px] text-center uppercase border-l-0 border-r-0 whitespace-nowrap">
                                    Tipo
                                </th>
                                <th
                                    class="px-4 bg-[#EEEE] text-[#6B7280] font-400 align-middle py-3 text-[13px] text-center uppercase border-l-0 border-r-0 whitespace-nowrap">
                                    Data criação
                                </th>
                                <th
                                    class="px-4 rounded-tr-md bg-[#EEEE] text-[#6B7280] font-400 align-middle py-3 text-[13px] text-center uppercase border-l-0 border-r-0 whitespace-nowrap">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="(item, index) in activities" :key="index" class="text-gray-500 w-full">
                                <td
                                    class="border-t-0 px-4 text-left font-400 text-[16px] text-[#6B7280] whitespace-nowrap p-4">
                                    {{ item?.name }}
                                </td>
                                <td
                                    class="border-t-0 px-4 text-center font-400 text-[16px] text-[#6B7280] whitespace-nowrap p-4">
                                    {{ item?.type }}
                                </td>
                                <td
                                    class="border-t-0 px-4 font-400 text-center text-[16px] text-[#6B7280] whitespace-nowrap p-4">
                                    {{ formatDate(item?.createdAt)
                                    }}
                                </td>
                                <td class="border-t-0 px-4 font-400 text-[16px] text-center whitespace-nowrap p-4">
                                    <button @click="sendActivity(item)" class="text-[#4F46E5]" type="button">
                                        Usar atividades
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <Pagination :totalItems="pagination.total" :currentPage="pagination.page"
                        @pageChange="(p: any) => changePage(p)" :itemsPerPage="3" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { http } from '@/api/api'
import { format } from 'date-fns';
import { onMounted, reactive, ref, watch } from 'vue'
import Pagination from './Pagination.vue';

interface Props {
    show: boolean
}
const activities = ref<any[]>([])
const index = ref(0)
const pagination = reactive({
    page: 1,
    limit: 10,
    total: 0
})
const props = defineProps<Props>()
const emits = defineEmits(['onClose', 'onSubmit', 'sendActivity'])

async function getContent() {
    try {
        const res = await http.get(`content?page=${pagination.page}&limit=3`)
        activities.value = res.data.items
        pagination.total = res.data.pagination.totalQuantity
    } catch (error) {
        console.log(error)
    }
}

watch(
    () => pagination.page,
    () => {
        getContent()
    },
    { deep: true }
)

onMounted(() => {
    getContent()
})

function changePage(p: any) {
    pagination.page = p
}

const formatDate = (date: any) => {
    const data: any = new Date(date);
    return format(data, 'dd/MM/yyyy');
}

const send = (type: string) => {
    emits('onSubmit', type)
}

const sendActivity = (item: any) => {
    emits('sendActivity', item)
}
</script>
