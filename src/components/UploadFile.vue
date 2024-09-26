<template>
  <div>
    <div class="w-full cursor-pointer relative border-2 border-gray-300 border-dashed rounded-lg p-6 bg-gray-100"
      id="dropzone">
      <input type="file" class="absolute cursor-pointer inset-0 w-full h-full opacity-0 z-50" @change="onFileChange"
        accept="image/*" />
      <div class="text-center">
        <div class="flex justify-center">
          <UploadIcon class="text-gray-400" />
        </div>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          <label for="file-upload" class="relative cursor-pointer">
            <!-- <span>Arraste ou solte</span> -->
            <span class="text-indigo-600">Clique para fazer o upload de uma imagem</span>

            <input @change="onFileChange" accept="image/*" id="file-upload" name="file-upload" type="file"
              class="sr-only cursor-pointer" />
          </label>
        </h3>
        <p class="mt-1 text-xs text-gray-500">PNG, JPG</p>
      </div>

      <img src="" class="mt-4 mx-auto max-h-40 hidden" id="preview" />
    </div>
    <!-- Exibição das pré-visualizações das imagens -->

    <div v-if="imagePreviews.length > 0" class="flex lg:flex lg:items-center lg:gap-2 my-5 lg:flex-wrap">
      <div v-for="(preview, index) in imagePreviews" :key="index">
        <div class="w-[300px] h-[200px] bg-cover rounded-lg bg-center"
          :style="{ backgroundImage: `url(${preview.blob ?? preview.url})` }">
          <div class="flex px-5 py-2 justify-between">
            <button class="bg-black text-white rounded-full w-[25px] h-[25px] flex items-center justify-center"
              @click.prevent="removeImage(preview, index)">
              X
            </button>
          </div>
        </div>
        <div v-if="props.hasCover" class="flex items-center gap-2 mt-3">
          <input type="checkbox" name="cover" class="w-5" v-model="preview.cover"
            @change="handleChangeCover(preview)" />
          <span class="stroke-black">Capa</span>
        </div>
      </div>
    </div>
    <div v-if="loading">
      <svg class="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import UploadIcon from '@/components/icones/UploadIcon.vue'
import * as ImportImage from '@/api/services/ImportImage';
import { blobToFile } from '@/util/helpers'
const props = defineProps({
  images: { type: Array, default: () => [] },
  hasCover: { type: Boolean, default: false }
})
const emits = defineEmits(['url', 'removeImg', 'updateCover'])

const imagePreviews = ref<any[]>(props.images)
const loading = ref(false)
const uploadProgress = ref<any[]>([])
const toast = useToast()
watch(
  () => props.images,
  () => {
    imagePreviews.value = props.images && Array.isArray(props.images) ? props?.images?.map((x: any) => {
      return x?.url ? x : { url: x }
    }) : []

    // imagePreviews.value
  }
)
const handleChangeCover = async (data: any) => {
  if (imagePreviews.value.filter((f) => f.cover == true).length > 1) {
    imagePreviews.value.map((f) => {
      if (f.url != data.url) f.cover = false
    })

    emits(
      'updateCover',
      imagePreviews.value.map((f) => {
        return { url: f.url, cover: f.cover }
      })
    )
  }
}
const onFileChange = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files) {
    return
  }

  const promises = []
  let fileInvalid = false

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.png') || fileName.endsWith('.jpeg') || fileName.endsWith('.jpg')) {
      const promise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result)
          } else {
            reject(new Error('Erro ao carregar a imagem'))
          }
        }
        reader.readAsDataURL(file)
      })
      promises.push(promise)

    } else {
      toast.error('Arquivo inválido.');
      fileInvalid = true
    }

  }
  if (!fileInvalid) {
    const results: any = await Promise.all(promises)
    let newArr = [...imagePreviews.value]

    loading.value = true
    const res = await uploadImages(results)
    newArr = [
      ...newArr,
      ...results.map((x: any) => {
        return { blob: x, url: res?.url }
      })
    ]

    if (res?.status === 400) {
      toast.error('Upload não enviado')
    } else {
      imagePreviews.value = newArr

      if (props.hasCover) {
        emits(
          'url',
          results.map(() => {
            return { url: res?.url }
          })[0]
        )
      } else emits('url', res?.url)
    }
  }
}

const base64ToBlob = (base64Data: any, contentType = 'image/jpeg') => {
  try {
    const base64Content = base64Data.split(',')[1]
    if (!base64Content) {
      throw new Error('Base64 data não encontrada.')
    }
    const byteCharacters = atob(base64Content)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: contentType })
  } catch (error) {
    return null
  }
}

const uploadImages = async (result: any) => {
  uploadProgress.value = result.map(() => 0)
  for (let index = 0; index < result.length; index++) {
    const base64Image = result[index]
    if (typeof base64Image === 'string') {
      const blob = base64ToBlob(base64Image)

      if (blob) {
        const keyItem = `imagem_${Date.now()}.jpg`

        try {
          const file = blobToFile(blob, keyItem)
          const data = await ImportImage.importImage(file, 'image')
          loading.value = false
          return {
            status: data.status,
            message: 'Upload com sucesso',
            url: data.url // URL do arquivo, ajuste conforme sua região se necessário
          }
        } catch (error) {
          loading.value = false
          console.error(`Erro ao fazer upload: ${error}`)
          return {
            status: 400,
            message: `Erro ao fazer upload: ${error}`
          }
        }
      } else {
        toast.error('Imagem base64 inválida ou formato incorreto.')
      }
    } else {
      toast.error('Entrada base64 não é uma string válida.')
    }
  }
}

const removeImage = (item: any, index: any) => {
  const a: any[] = imagePreviews.value
  const indexa = a.indexOf(item)
  if (indexa > -1) {
    imagePreviews.value.splice(index, 1)
  }
  emits('removeImg', index)
}
</script>
