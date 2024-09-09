<template>
    <div>
        <Teleport to="body">
            <div class="p-6 fixed z-[99999] inset-0 bg-black bg-opacity-50 flex items-center justify-center">

                <div class="bg-white rounded-lg flex flex-col gap-2 shadow-sm p-4  w-[600px]">
                    <div class="flex justify-between mb-5">
                        <p class="text-2xl font-semibold text-[#19224D]">Progresso detalhado</p>
                        <span class="cursor-pointer text-gray-700 hover:text-[#4F46E5] transition-all duration-300"
                            @click="closeModal">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block ml-2"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5.293 5.293a1 1 0 0 1 1.414 0L10 8.586l3.293-3.293a1 1 0 1 1 1.414 1.414L11.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L8.586 10 5.293 6.707a1 1 0 0 1 0-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </span>

                    </div>
                    <p class="text-sm font-semibold text-[#4F46E5]">Trilha {{ props.index + 1 }}</p>
                    <div>
                        <p class="text-xl font-semibold text-[#19224D]">{{ props.trail.name }}</p>
                        <p v-html="props.trail.trailDescription" class="text-sm text-gray-500"></p>

                    </div>

                    <div>
                        <p class="text-sm font-bold text-[#19224D]">ULTIMO CONTEÚDO ACESSADO</p>
                        <span class="text-sm text-gray-500">{{ props.trail.lastContentAccess ?
                            `${props.trail.lastContentAccess?.name} - ${props.trail.lastContentAccess?.type}` : 'Nenhum conteúdo acessado' }}</span>
                    </div>

                    <div>
                        <p class="text-sm font-bold text-[#19224D]">DATA DE INÍCIO DA TRILHA</p>
                        <span class="text-sm text-gray-500">{{ props.trail.dateInicialTraining ? new
                            Date(props.trail.dateInicialTraining).toLocaleString('pt-BR').split(',')[0] : 'Não iniciado'
                            }}</span>
                    </div>


                    <div>
                        <p class="text-sm font-bold text-[#19224D]">PONTUAÇÃO</p>
                        <span class="text-sm text-gray-500">{{ props.trail.punctuaction }} pontos</span>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-[#19224D]">TEMPO MÉDIO DE VISUALIZAÇÃO</p>
                        <span class="text-sm text-gray-500">{{ props.trail.averageTimeVisualization ?
                            sanitizeTime(props.trail.averageTimeVisualization) : 'Não iniciado'
                            }}</span>
                    </div>

                    <div class="mb-2">
                        <ProgressConclusion :progress="props.trail.trailProgressConclusion"
                            label="PROGRESSO DE CONCLUSÃO" />
                    </div>

                    <div v-if="!loading" class="mt-10 overflow-y-auto h-[400px] px-4">
                        <div v-for="data, index in contentData" :key="data.name">
                            <div class="flex justify-between">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span v-if="data.isCompleted" class="rounded-full bg-[#7de093] p-1">
                                            <CheckIcon class="w-4 h-4 text-[#4F46E5]" />

                                        </span>

                                        <p class="text-xl">{{ `${index + 1}. ${data.content.name}` }}</p>

                                        <QRIcon v-if="data.content.type === 'QUIZZ'" class="text-[#4F46E5]" />
                                        <CameraIcon v-if="data.content.type === 'VIDEOS'" class="text-[#4F46E5]" />
                                        <MemoryGameIcon v-if="data.content.type === 'GAME'" class="text-[#4F46E5]" />

                                    </div>
                                </div>
                                <span class="px-2 py-1 text-sm rounded-sm bg-[#D3DDFF] text-[#4B5563]">{{
                                    sanitizeType(data.content.type) }}</span>
                            </div>
                            <p v-if="data.isCompleted" class="text-sm text-gray-500 mt-2">Concluído em {{ new
                                Date(data.content.createdAt).toLocaleString('pt-BR').replace(',', ' às') }}</p>
                            <p v-else class="text-sm text-gray-500 mt-2">Ainda não realizado</p>
                            <div class="w-full h-[1px] border-[1px] border-[#e4e7ee] mt-4 mb-4" />
                        </div>
                    </div>
                    <div v-else>
                        <div class="flex justify-center items-center h-[400px]">
                            <LSpinner />
                        </div>
                    </div>

                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import ProgressConclusion from './ProgressConclusion.vue';
import CheckIcon from './icones/CheckIcon.vue';
import QRIcon from './icones/QRIcon.vue';
import CameraIcon from './icones/CameraIcon.vue';
import MemoryGameIcon from './icones/MemoryGameIcon.vue';
import { onMounted, ref } from 'vue';
import LSpinner from './Spinner.vue';
import * as IndividualStepService from '@/api/services/IndividualStepService';
import { useRoute } from 'vue-router';

interface IProps {
    trail: any,
    index: number,
    trainingId: number
}

const route = useRoute()

const routeId = route.params.id

const props = defineProps<IProps>()

const emit = defineEmits(['closeModal'])

const contentData = ref<any[]>([])
const loading = ref<boolean>(false)
const timeHMS = ref<string>('')

const closeModal = () => {
    emit('closeModal')
}

const sanitizeTime = (time: number) => {
    let convertedTime = '';
    if (time >= 86400000) {
        convertedTime = Math.floor(time / 86400000) + ' dias';
    } else if (time >= 3600000) {
        convertedTime = Math.floor(time / 3600000) + ' horas';
    } else if (time >= 60000) {
        convertedTime = Math.floor(time / 60000) + ' minutos';
    } else {
        convertedTime = Math.floor(time / 1000) + ' segundos';
    }
    timeHMS.value = convertedTime
    return convertedTime
}

const sanitizeType = (type: string) => {
    switch (type) {
        case 'QUIZZ':
            return 'Quiz'
        case 'VIDEOS':
            return 'Vídeo'
        case 'GAME':
            return 'Jogo'
        default:
            return 'Conteúdo'
    }
}

onMounted(async () => {
    loading.value = true
    try {
        const res = await IndividualStepService.getByTrailId(props.trainingId, props.trail.id, routeId)
        contentData.value = res.data.items[0].contents

    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
})

</script>

<style scoped></style>