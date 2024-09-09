<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Form } from 'vee-validate'
import * as authServices from '../../api/services/AuthService'
import { recoverTokenValidation, completeRegistration } from '@/api/services/User'
import { useToast } from 'vue-toastification'
import FullSpinner from '@/components/FullSpinner.vue'
import session from '@/composables/useSession'
import { useRoute, useRouter } from 'vue-router'
const useSession = session()

const router = useRouter()
const route = useRoute()
const toast = useToast()
const id = ref(0)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

onMounted(() => {
    validateToken()
})

const validateToken = async () => {
    try {
        loading.value = true
        const res = await recoverTokenValidation(route.query.token)

        id.value = res.data.id
        email.value = res.data.email
    } catch (error) {
        router.push('/')
        console.log(error)
    }
    finally {
        loading.value = false
    }
}

const redefine = async () => {
    try {
        loading.value = true
        await authServices.resetPassword(String(route.query.token), { newPassword: password.value })
        toast.success('Senha alterada com sucesso')

        router.push('/')
    } catch (error) {
        console.log(error)
        router.push('/')
    }
    finally {
        loading.value = false
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

            <Form @submit="redefine">
                <p class="text-[#4F46E5] font-semibold text-[25px] mt-5 mb-2">Redefinir senha</p>
                <p class="text-[#374151] text-[14px]">
                    Informe os dados abaixo para cadastrar uma nova senha para sua conta
                </p>

                <div class="my-5">
                    <base-input v-model="password" type="password" name="password" label="Nova senha"
                        rules="required" />
                </div>


                <div class="my-5">
                    <base-input v-model="confirmPassword" type="password" name="confirmpass"
                        label="Confirmar nova senha" rules="required|password:@password" />
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
