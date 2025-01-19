<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebar } from '../composables/useSidebar'
import IDashboard from './icones/IDashboard.vue'
import IUser from './icones/IUser.vue'
import IPrice from './icones/IPrice.vue'
import Company from './icones/Company.vue'
import RoleIcon from './icones/RoleIcon.vue'
import ListIcon from './icones/ListIcon.vue'
import ImportIcon from './icones/ImportIcon.vue'
import IContracts from './icones/IContracts.vue'

import IMessage from './icones/IMessage.vue'

const { isOpen } = useSidebar()
const router = useRoute()

const activeClass = ref('bg-[#202733] text-white py-5 border-l border-l-[4px] border-white')
const inactiveClass = ref('py-3 text-[#6b7280]')
const activeClassText = ref('text-white')
const inactiveClassText = ref('text-[#6b7280]')

const link = [
    { id: 1, title: 'Dashboard', path: '/dashboard' },
    // { id: 9, title: 'Importações', path: '/importacoes' },
    { id: 2, title: 'Clientes', path: '/usuarios' },
    // { id: 16, title: 'Contatos', path: '/contatos' },
    { id: 3, title: 'Usuários', path: '/usuarios-admin' },
    { id: 4, title: 'Imóveis', path: '/imoveis' },
    { id: 5, title: 'Planos', path: '/planos' },
    { id: 6, title: 'Contrato', path: '/contrato' },
    { id: 7, title: 'Termos de uso', path: '/termos-de-uso' },
    // { id: 5, title: 'Cargos', path: '/cargos' },
    // { id: 6, title: 'Setores', path: '/setores' },
]

const linkActive = ref('/dashboard')


watch(router, () => {
    linkActive.value = router.fullPath
})

function colorIcon(item: any) {
    return router.fullPath === item.path ? '#111827' : '#fff'
}
</script>

<template>
    <div class="flex">
        <div :class="isOpen ? 'block' : 'hidden'"
            class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden" @click="isOpen = false" />

        <div :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
            class="fixed inset-y-0 left-0 z-30 overflow-y-auto transition duration-300 min-w-[256px] transform bg-[#111827] lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col lg:items-center">
            <div class="flex items-center justify-center mt-8">
                <img src="/logo.png" alt="Logo" class="w-[164px]" />
            </div>

            <nav class="mt-10 w-full">
                <div v-for="item in link" :key="item.id">
                    <router-link class="flex items-center px-6 duration-200"
                        :class="[linkActive === item.path ? activeClass : inactiveClass]" :to="item.path">
                        <IDashboard v-if="item.path === '/dashboard'" :color="colorIcon(item)" />
                        <IUser v-if="item.path === '/usuarios'" :color="colorIcon(item)" />
                        <IUser v-if="item.path === '/usuarios-admin'" :color="colorIcon(item)" />
                        <Company v-if="item.path === '/imoveis'" :color="colorIcon(item)" />
                        <RoleIcon v-if="item.path === '/cargos'" :color="colorIcon(item)" />
                        <ListIcon v-if="item.path === '/setores'" :color="colorIcon(item)" />
                        <ImportIcon v-if="item.path === '/importacoes'" :color="colorIcon(item)" />
                        <IMessage v-if="item.path === '/contatos'" :color="colorIcon(item)" />
                        <IPrice v-if="item.path === '/planos'" />
                        <IContracts v-if="item.path === '/contrato'" />
                        <IContracts v-if="item.path === '/termos-de-uso'" />

                        <span class="mx-4" :class="[linkActive === item.path ? activeClassText : inactiveClassText]">{{
                            item.title
                        }}</span>
                    </router-link>
                    <div v-if="item.path === '/dashboard'" class="flex gap-2 px-6 items-center mt-6 mb-2">
                        <p class=" text-[#495386] text-sm tracking-widest">USUÁRIOS</p>
                        <hr class="w-full my-2 border-[#495386]" />
                    </div>
                    <div v-if="item.path === '/importacoes'" class="flex gap-2 px-6 items-center mt-6 mb-2">
                        <p class=" text-[#495386] text-sm tracking-widest">USUÁRIOS</p>
                        <hr class="w-full my-2 border-[#495386]" />
                    </div>
                    <div v-if="item.path === '/usuarios-admin'" class="flex gap-2 px-6 items-center mt-6 mb-2">
                        <p class=" text-[#495386] text-sm tracking-widest">IMÒVEIS</p>
                        <hr class="w-full my-2 border-[#495386]" />
                    </div>
                    <div v-if="item.path === '/imoveis'" class="flex gap-2 px-6 items-center mt-6 mb-2">
                        <p class=" text-[#495386] text-sm tracking-widest">PLANOS</p>
                        <hr class="w-full my-2 border-[#495386]" />
                    </div>
                    <div v-if="item.path === '/planos'" class="flex gap-2 px-6 items-center mt-6 mb-2">
                        <p class=" text-[#495386] text-sm tracking-widest">CONFIGURAÇÕES</p>
                        <hr class="w-full my-2 border-[#495386]" />
                    </div>
                </div>
            </nav>
        </div>
    </div>
</template>
