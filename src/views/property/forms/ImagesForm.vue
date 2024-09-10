<script lang="ts" setup>
import { ref } from 'vue'
import TrashIcon from '@/components/icones/Trash.vue'
import PlusImage from '@/components/icones/PlusImage.vue'
import { importImage } from '@/api/services/ImportImage'
const props = withDefaults(
  defineProps<{
    images: { id?: number; url: string }[]
  }>(),
  {
    images: []
  }
)

const emit = defineEmits(['addImage', 'removeImage'])

const loadingSaveImage = ref(false)
const inputFile = ref<HTMLInputElement | null>(null)
async function handleAddImage(event: Event) {
  if (loadingSaveImage.value) return
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    try {
      loadingSaveImage.value = true
      const res = await importImage(file, 'image')
      emit('addImage', { url: res.data, id: Math.random() })
    } catch (error) {
      console.error(error)
    } finally {
      loadingSaveImage.value = false
      inputFile.value = null
    }
  }
}
</script>
<template>
  <section>
    <h4 class="text-xl font-semibold text-gray-700 mb-4">Imagens</h4>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div
        v-for="image in images"
        :key="image.id"
        class="w-full flex items-center justify-center relative"
      >
        <div
          class="absolute left-0 top-0 w-full h-full bg-[rgba(0,0,0,.2)] hover:bg-[rgba(0,0,0,.5)] transition-all"
        >
          <div class="absolute top-2 right-2">
            <base-checkbox class="text-white" label="Destaque" />
            <button class="text-white text-sm underline flex items-center gap-2 mt-2" @click="emit('removeImage', image)">
              <TrashIcon class="" size="20" color="#fff" />
              Excluir
            </button>
          </div>
        </div>
        <img :src="image.url" alt="Imagem do Imóvel" class="object-cover" />
      </div>
      <div class="w-full min-h-64 relative">
        <label
          type="button"
          title="Adicionar Imagem"
          v-tooltip="'Adicionar Imagem'"
          class="flex justify-center cursor-pointer items-center w-full h-full bg-[rgba(0,0,0,.2)] hover:bg-[rgba(0,0,0,.5)] transition-all"
        >
          <LoadingGit v-if="loadingSaveImage" size="120" />
          <PlusImage v-else size="120" color="#fff" />
          <input ref="inputFile" type="file" class="hidden" @change="handleAddImage" />
        </label>
      </div>
    </div>
  </section>
</template>
