<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'
import * as authServices from '@/api/services/AuthService'
import { useToast } from 'vue-toastification'
import FullSpinner from '@/components/FullSpinner.vue';

const toast = useToast()
const email = ref('')
const loading = ref(false)

const sendEmail = async () => {
    try {
        loading.value = true
        const res = await authServices.sendEmail(email.value)

        toast.success('E-mail enviado com sucesso')
    } catch (error) {
        console.log(error)
    }
    finally {
        loading.value = true
    }
}
</script>

<template>
    <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
        <FullSpinner v-if="loading" />
        <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
            <div class="flex justify-center">
                <img src="/logo.png" />
            </div>

            <Form @submit="sendEmail">
                <p class="text-[#4F46E5] font-semibold text-[25px] mt-5 mb-2">Redefinir senha</p>
                <p class="text-[#374151] text-[14px]">
                    Insira seu e-mail para redefinir sua senha de acesso
                </p>

                <div class="my-5">
                    <base-input v-model="email" label="E-mail" rules="required|email" />
                </div>

                <button type="submit"
                    class="w-full px-4 py-2 mt-5 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500">

                    <span>Redefinir senha</span>
                </button>
            </Form>

            <button class="text-[#4338CA] text-[14px] font-400 underline mt-4" type="button"
                @click.prevent="$router.push('/')">
                Voltar
            </button>
        </div>
    </div>
</template>
