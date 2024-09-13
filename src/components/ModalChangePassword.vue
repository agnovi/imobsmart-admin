<template>
    <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="flex justify-between">
                        <h3 class="text-2xl leading-6 font-medium text-[#1C46B4]" id="modal-title">
                            Alterar senha
                        </h3>
                        <button @click="emit('close')" type="button"
                            class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                            <span class="sr-only">Close</span>
                            <svg class="h-6 w-6" x-description="Heroicon name: outline/x"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <p class="text-sm text-gray-500 my-4">Informe os dados abaixo para alterar sua senha</p>
                    <div>
                        <label for="oldPassword" class="block text-sm font-medium text-gray-700">Senha Antiga</label>
                        <input v-model="payload.oldPassword" type="password" name="oldPassword" id="oldPassword"
                            class="mt-1 block w-full sm:text-sm border-gray-300 rounded-md">
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">Nova Senha</label>
                        <input v-model="payload.password" type="password" name="password" id="password"
                            class="mt-1 block w-full sm:text-sm border-gray-300 rounded-md">
                    </div>
                    <div class="mt-4">
                        <label for="confirmationPassword" class="block text-sm font-medium text-gray-700">Confirmar
                            nova senha</label>
                        <input v-model="payload.confirmationPassword" type="password" name="confirmationPassword"
                            id="confirmationPassword" class="mt-1 block w-full sm:text-sm border-gray-300 rounded-md">
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button @click="submitNewPassword" type="button"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#1C46B4] text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm">
                        Salvar nova senha
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue'
import { useToast } from 'vue-toastification';
import useAuth from '@/composables/useSession'
import { resetPassword } from '@/api/services/AdminService';

const toast = useToast()
const { userState } = useAuth()

const emit = defineEmits(['close'])

interface passwordChange {
    oldPassword: string,
    password: string,
    confirmationPassword: string
}

const payload = ref<passwordChange>({
    oldPassword: '',
    password: '',
    confirmationPassword: ''
})

async function submitNewPassword() {

    if (payload.value.password !== payload.value.confirmationPassword) {
        toast.error('As senhas não conferem')
        return
    }
    
    try {

        const body = {
            oldPassword: payload.value.oldPassword,
            password: payload.value.password
        }
        
        await resetPassword(userState.value.id, body);
        toast.success('Senha alterada com sucesso')
        emit('close')
    } catch (error) {
        console.log(error);
        
    }
   
    

}

</script>