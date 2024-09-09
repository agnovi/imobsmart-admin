<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import ImageResize from 'quill-image-resize'
import Quill from 'quill'
import QuillEditor from './Editor.vue'

const props = defineProps(['modelValue', 'disabled'])

const emit = defineEmits(['update:modelValue', 'focus', 'change', 'ready', 'blur'])
Quill.register('modules/imageResize', ImageResize)

const editorOption = {
  placeholder: 'Digite aqui...',
  modules: {
    imageResize: true,
  },
}

const id = ref<string>('')

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
const onEditorBlur = () => {
  emit('blur', value.value)
}
const onEditorFocus = () => {
  emit('focus', value.value)
}
const onEditorReady = () => {
  emit('ready', value.value)
}
const onEditorChange = () => {
  emit('change', value.value)
}

function generateUniqueId(prefix = 'id') {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 7)
  return `${prefix}-${timestamp}-${random}`
}

onMounted(() => {
  id.value = generateUniqueId()
})
</script>

<template>
  <div style="margin-bottom: 63px" :class="`relative ${disabled && 'opacity-50'}`">
    <QuillEditor v-model:value="value" :id="id" :options="editorOption" :disabled="props.disabled" @blur="onEditorBlur"
      @focus="onEditorFocus" @ready="onEditorReady" @change="onEditorChange" class="bg-white" />
  </div>
</template>
