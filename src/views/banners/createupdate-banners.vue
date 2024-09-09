<script lang="ts" setup>
import { Form } from 'vee-validate'

import Input from '@/components/Input.vue'
import ISave from '../../components/icones/ISave.vue'
import * as BannersService from '@/api/services/BannersService'
import * as ScreensService from '@/api/services/ScreensService'

import * as ClusterApoioService from '@/api/services/ClusterApoioService'

import { onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import FullSpinner from '@/components/FullSpinner.vue'
import UploadFile from '@/components/UploadFile.vue'
import { http } from '@/api/api'
import useAuth from '@/composables/useSession'
import { customFilter } from '@/util/helpers'

const { token } = useAuth()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const listRoles = ref<any[]>([])
const listClusters = ref<any[]>([])
const data = reactive<any>({
  id: '',
  link: '',
  image: [],
  screen: undefined,
  roles: [],
  clustertypes: []
})
const loading = ref(false)
const listScrrens = ref<any[]>([])
onMounted(async () => {
  if (token.value) {
    getAllScreens()
    await loadListCluster()
    if (route.fullPath === `/editar-banner/${route.params.id}`) getById()
  }
})

async function getAllScreens() {
  const res = await ScreensService.list()
  listScrrens.value = res.data.items
}

async function loadListCluster() {
  try {
    const res = await ClusterApoioService.list()
    const resRoles = await http.get('/role')
    listClusters.value = res.data.items
    listRoles.value = resRoles.data.items
  } catch (error) {
    console.log(error)
  }
}

async function getById() {
  loading.value = true
  try {
    const c: any = await BannersService.get(route.params.id)
    data.image = [c?.data?.image]
    data.link = c.data.link
    data.screen = c?.data.screen
    data.id = c?.data.id
    data.roles = c?.data.roles.map((c: any) => c.id)
    data.clustertypes = c?.data.clusters.map((c: any) => c.cluster_types_id)
  } catch (error) {
    loading.value = false
  } finally {
    loading.value = false
  }
}

async function onsubmit() {
  if (!data.image.length) {
    toast.warning('Banner Obrigatório')
    return
  }

  if (!data.screen) {
    toast.warning('Tela Obrigatória')
    return
  }

  loading.value = true
  try {
    if (route?.fullPath === '/adicionar-banner') {
      await BannersService.create({
        link: data.link,
        image: data.image[0],
        screenId: data.screen.id,
        roles: data.roles,
        clustertypes: data.clustertypes
      })
    } else {
      await BannersService.edit(
        {
          link: data.link,
          image: data.image[0],
          screenId: data.screen.id,
          roles: data.roles,
          clustertypes: data.clustertypes
        },
        route.params.id
      )
    }

    toast.success('Banner salva com sucesso')
    router.back()
  } catch (error) {
    toast.error('Erro ao salvar a banner')
  } finally {
    loading.value = false
  }
}
function capitalizeFirstLetter(text: string): string {
  if (!text) return text // Verifica se a string não está vazia
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function selectUrls(u: any) {
  const arr: any = data.image
  const newUrls: any = [...arr]
  newUrls.push(u)
  data.image = newUrls
}

const removeImage = (i: any) => {
  console.log(i)
  data.image = []
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
        {{ route?.fullPath === '/adicionar-banner' ? 'Nova Banner' : 'Editar Banner' }}
      </h3>
      <button class="border border-gray-600 rounded px-2 text-md" @click="$router.go(-1)">
        Voltar
      </button>
    </div>
    <Form @submit="onsubmit" class="p-6 bg-white rounded-md shadow-md">
      <div class="w-[90%] lg:w-[60%] flex flex-col gap-5">
        <h2 class="text-gray-700">Banner*</h2>
        <UploadFile @url="(urls: any) => selectUrls(urls)" :images="data.image"
          @remove-img="(i: any) => removeImage(i)" />

        <div class="flex flex-col lg:flex-row lg:items-center lg:gap-3">
          <Input v-model="data.link" label="Link" placeholder="Digite o link do banner" />
        </div>
      </div>
      <div class="w-[90%] lg:w-[60%] flex flex-col gap-5 my-3">
        <div class="flex flex-col gap-3">
          <p>Tela</p>
          <v-select placeholder="Selecione a tela para exibição" v-model="data.screen"
            class="w-full border rounded-md border-gray-300" :options="listScrrens" label="name" value="id"
            :filter="customFilter" />
        </div>
      </div>

      <div>
        <h2 class="text-gray-700">Cargos</h2>
        <div class="flex gap-3 flex-wrap">
          <div v-for="item in listRoles" :key="item.id">
            <div class="flex gap-3 items-center my-5">
              <input type="checkbox" @change="checkedItem(item, data.roles)"
                :checked="data?.roles?.includes(item.id)" />
              <label class="text-gray-700">{{ capitalizeFirstLetter(item.name) }}</label>
            </div>
          </div>
        </div>

        <div v-for="item in listClusters.filter((x) => x.types.length > 0)" :key="item.id">
          <h2 class="text-gray-700">
            {{ item.name }}
          </h2>
          <div class="flex flex-row gap-4 flex-wrap">
            <div v-for="cluster in item.types" :key="cluster.id">
              <div class="flex gap-3 items-center my-5">
                <input type="checkbox" @change="checkedItem(cluster, data.clustertypes)"
                  :checked="data?.clustertypes?.includes(cluster.id)" />
                <label class="text-gray-700">{{ capitalizeFirstLetter(cluster.name) }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="bg-[#4F46E5] py-3 px-4 flex items-center gap-3 rounded-md text-white"
          label="Criar banner">
          <ISave />
          Salvar banner
        </button>
      </div>
    </Form>
  </div>
</template>
