<template>
    <div class="absolute z-[100] inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-10">
        <div class="bg-white shadow-md w-[90%] p-5 rounded-lg">
            <div class="flex flex-row justify-between items-start">
                <div>
                    <h1 class="text-[#374151] text-[18px]">{{ props.listError.length > 1 ? 'Foram' : 'Foi' }}
                        encontrado{{
                        props.listError.length > 1 ? 's' : '' }} {{
                        props.listError.length }} erro{{ props.listError.length > 1 ? 's' : '' }} na planilha
                        importada. Verifique
                        os erros encontrados abaixo</h1>
                    <p class="text-[#374151] text-[14px] my-4">Verifique os erros encontrados abaixo e faça o upload do
                        arquivo novamente</p>
                </div>
                <div>
                    <button @click="props.onClose">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="icon icon-tabler icons-tabler-outline icon-tabler-x">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M18 6l-12 12" />
                            <path d="M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div>
                <div class="overflow-auto scrollbar-hide h-[300px]">
                    <table class="items-center w-full bg-transparent border-collapse">
                        <thead>
                            <tr>
                                <th
                                    class="px-4 w-[70%] rounded-tl-md bg-[#EEEE] text-gray-700 align-middle py-3 text-[13px] font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap">
                                    Erro</th>
                                <th
                                    class="px-4 w-[10%] bg-[#EEEE] text-gray-700 align-middle py-3 text-[13px] font-semibold text-right uppercase border-l-0 border-r-0 whitespace-nowrap">
                                    Linha</th>
                                <th
                                    class="px-4 w-[20%] rounded-tr-md bg-[#EEEE] text-gray-700 align-middle py-3 text-[13px] font-semibold text-right uppercase border-l-0 border-r-0 whitespace-nowrap">
                                    Coluna</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="(item, index) in props.listError" :key="index" class="text-gray-500  w-full">

                                <td
                                    class="border-t-0 px-4 align-middle text-[16px]  text-gray-900 whitespace-nowrap p-4">

                                    <div class="flex gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="#681E1E" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="icon icon-tabler icons-tabler-outline icon-tabler-file-x">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                            <path
                                                d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                            <path d="M10 12l4 4m0 -4l-4 4" />
                                        </svg>
                                        <p class="text-[#681E1E]">{{ item?.message }}</p>
                                    </div>
                                </td>
                                <td
                                    class="border-t-0 px-4 text-end font-semibold  text-[16px]  text-[#374151] whitespace-nowrap p-4">
                                    {{ item?.line }}</td>
                                <td
                                    class="border-t-0 px-4 text-end text-[16px] font-semibold  text-[#374151] whitespace-nowrap p-4">
                                    {{ item?.column }}</td>


                            </tr>

                        </tbody>
                    </table>
                </div>
                <div class="w-full flex  justify-end mt-5">
                    <button @click="props.onClose" class="bg-[#EBEBEB] text-[#2E2E2E] font-normal rounded-md px-3 py-3">
                        Fechar
                    </button>
                </div>

            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>

interface Props {
    onClose: Function
    listError: any
}

const props = defineProps<Props>()

</script>
