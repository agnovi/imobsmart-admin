<script setup lang="ts">
import { ref, watch } from 'vue'
import IDownload from '../components/icones/IDownload.vue';
import Table from '../components/Table.vue';
import { validateFile, getRowsAndColumns } from '@/util/validateFile';
import { ColumnImport } from '@/types/import';
import { useRouter } from 'vue-router';


interface IProps {
  columns: any
  columnsFile: ColumnImport[]
  isCompany?: boolean
  title?: string
  uploadText: string
  noDownload?: boolean
  noBack?: boolean
  hasMonthSelect?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  isCompany: false
})

const router = useRouter()

const rowsErrors = ref<any[]>([])
const columnsErrors = ref<any[]>([])

const loadingFile = ref(false)

const selectedMonth = ref<string>('01')

const activeFile = ref<File | null>(null)

const showModal = ref(false)

const emit = defineEmits(['file-uploaded', 'download-template', 'update:selectedMonth'])

const monthList = [
  { label: 'Janeiro', value: '01' },
  { label: 'Fevereiro', value: '02' },
  { label: 'Março', value: '03' },
  { label: 'Abril', value: '04' },
  { label: 'Maio', value: '05' },
  { label: 'Junho', value: '06' },
  { label: 'Julho', value: '07' },
  { label: 'Agosto', value: '08' },
  { label: 'Setembro', value: '09' },
  { label: 'Outubro', value: '10' },
  { label: 'Novembro', value: '11' },
  { label: 'Dezembro', value: '12' },
]

const handleFileUpload = async (e: Event) => {
  loadingFile.value = true
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) {
    loadingFile.value = false
    return
  }

  activeFile.value = file

  loadingFile.value = false
  await postFile(file)
}

const postFile = async (file: File) => {
  loadingFile.value = true

  const isValid = await validateFile(file, props.columnsFile)
  let rowsColumns
  if (isValid === 'error') {
    loadingFile.value = false
    rowsColumns = getRowsAndColumns()
    rowsErrors.value = rowsColumns?.rows
    columnsErrors.value = rowsColumns?.columnsFile
    showModal.value = true
    return
  } else if (!isValid) {
    loadingFile.value = false
    return
  }
  const formData = new FormData()
  formData.append('file', file)
  startTimer()
  await new Promise((resolve) => setTimeout(resolve, 2000))
  emit('file-uploaded', formData)


  loadingFile.value = false
}



const uploadFile = () => {
  const fileInput = document.getElementById('file-upload') as HTMLInputElement
  fileInput.click()
}

const downloadTemplate = async () => {
  emit('download-template')
}

const handleFileDrop = async (e: DragEvent) => {
  loadingFile.value = true
  dropzoneClasses.value = 'h-[228px] flex items-center justify-center border border-dashed border-2 border-gray-300 w-[610px] mb-8 bg-white rounded-lg'
  e.preventDefault()
  const file = e.dataTransfer?.files?.[0]
  if (!file) return
  activeFile.value = file
  loadingFile.value = false
  await postFile(file)
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  dropzoneClasses.value = 'h-[228px] flex items-center justify-center border border-dashed border-2 border-gray-300 w-[610px] mb-8 bg-white rounded-lg'
}

const dropzoneClasses = ref('h-[228px] flex items-center justify-center border border-dashed border-2 border-gray-300 w-[610px] mb-8')

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  dropzoneClasses.value = 'h-[228px] flex items-center justify-center border border-dashed border-2 border-gray-300 w-[610px] mb-8 bg-gray-200 rounded-lg'
}

const closeModal = () => {
  showModal.value = false
}

const timer = ref<NodeJS.Timeout | null>(null)
const loadingBarWidth = ref(0)

const startTimer = () => {
  loadingBarWidth.value = 0
  timer.value = setInterval(() => {
    if (loadingBarWidth.value < 100) {
      loadingBarWidth.value += 1
    } else {
      clearInterval(timer.value as NodeJS.Timeout)
    }
  }, 100)
}

watch(() => selectedMonth.value, () => {
  if (selectedMonth.value) {
    emit('update:selectedMonth', selectedMonth.value)
  }
})

</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row gap-2 justify-between mb-2">
      <h3 class="text-3xl font-medium text-gray-700 ">
        {{ props.title || '' }}
      </h3>
      <div class="flex gap-2">
        <button v-if="!noBack" class="border border-gray-600 rounded px-2 text-md"
          @click="router.go(-1)">Voltar</button>
        <button class="bg-[#4F46E5] text-white font-medium py-2 px-4 rounded flex items-center"
          @click="router.push('/importacoes')">
          Ir para importações
        </button>
      </div>


    </div>

    <div class="bg-white rounded-lg py-16 flex flex-col font-medium items-center">
      <div>
        <h4 :class="!props.hasMonthSelect ? 'mb-16 px-5' : ''">
          {{ props.uploadText }}
        </h4>
        <div v-if="props.hasMonthSelect" class="mb-6 w-full">
          <base-input is-slot>
            <v-select v-model="selectedMonth" :reduce="(option: any) => option.value" class=" w-full" :options="monthList">
              <template #no-options>
                Nenhuma coluna encontrada
              </template>
            </v-select>
          </base-input>
        </div>
      </div>

      <div class="relative z-10" id="dropzone" :class="dropzoneClasses" @dragenter="handleDragEnter"
        @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleFileDrop">
        <div v-if="!loadingFile" class="flex flex-col items-center py-16 px-24 pointer-events-none">
          <IDownload class="mb-4" />
          <p for="file-upload" class="cursor-pointer">
            <span class="text-xl font-medium text-gray-700">Click ou arraste o arquivo</span>
            <input id="file-upload" type="file" accept=".xls,.csv,.xlsx" class="hidden" @change="handleFileUpload" />
          </p>
          <button class="mt-4 bg-[#4F46E5] text-white font-normal py-2 px-4 rounded pointer-events-auto"
            @click="uploadFile">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M8 15a7 7 0 100-14 7 7 0 000 14zm7-1l4 4-4 4-1-1 3-3-3-3 1-1 3 3zM8 13a5 5 0 100-10 5 5 0 000 10z"
                clip-rule="evenodd" />
            </svg>
            Procurar arquivo
          </button>
        </div>


        <div v-else class="flex flex-col items-center pointer-events-none">
          <div class="mb-4">
            <div class="bg-gray-200 h-2 w-48 rounded">
              <div class="bg-[#4F46E5] h-2 rounded transition" :style="{ width: loadingBarWidth + '%' }"></div>
            </div>
          </div>
          <span class="text-lg font-medium text-gray-700">Fazendo upload</span>
        </div>

      </div>
      <div v-if="!noDownload" class="mb-8 flex flex-col items-center bg-gray-200 rounded-lg py-8 px-14 w-[610px]">
        <span class="text-lg font-medium text-gray-700">Faça o download de nossa planilha modelo para importação</span>
        <button
          class="mt-4 cursor-pointer bg-white hover:bg-[#4F46E5] hover:text-white transition duration-300 flex items-center  font-medium py-2 px-4 rounded"
          @click="downloadTemplate">
          <label class="font-normal cursor-pointer">Baixar modelo de planilha</label>
          <IDownload class="h-4 w-4 inline-block ml-2 " />
        </button>
      </div>
    </div>
    <div v-if="showModal" id="modal"
      class="fixed z-[50] inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-8 w-[1200px]">
        <div class="flex justify-between items-center">
          <h3 class="text-2xl font-medium text-gray-700">Erros na importação</h3>
          <button @click="closeModal">
            <span class="cursor-pointer text-gray-700 hover:text-[#4F46E5] transition-all duration-300"
              @click="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 5.293a1 1 0 0 1 1.414 0L10 8.586l3.293-3.293a1 1 0 1 1 1.414 1.414L11.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L8.586 10 5.293 6.707a1 1 0 0 1 0-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </span>
          </button>
        </div>
        <Table :rows="rowsErrors" :columns="columnsErrors" :can-paginate="false" />
      </div>
    </div>

  </div>
</template>
