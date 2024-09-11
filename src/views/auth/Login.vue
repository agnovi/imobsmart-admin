<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification';
import session from '@/composables/useSession'
import * as authServices from '@/api/services/AuthService'
const router = useRouter()
const useSession = session()
const toast = useToast()
const loading = ref(false)
const email = ref('')
const password = ref('')
const recoverEmail = ref('')
async function login() {
  try {
    loading.value = true
    const res = await useSession.login({ email: email.value, password: password.value })
    if (res.error) {
      toast.error('Erro ao efetar login!')
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    console.log(error)
  }
  finally {
    loading.value = false
  }
}

</script>
<template>
  <div class="bg-gray-200 min-h-screen">
    <div class="bg-[#2a382a] flex justify-center items-center h-[300px]">
        <div><img src="/logo.png" alt="banner" class="" /></div>
      </div>
    <div class="flex items-center justify-center px-6 area-login">
      <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
        <h1 class="text-center mt-4 text-[#4F46E5] font-700 text-[24px]">Fazer Login</h1>
        <Form @submit="login" class="mt-4">
          <base-input v-model="email" label="Email" rules="required|email" />
          <base-input v-model="password" type="password" label="Senha" rules="required" />
          <div class="flex items-center justify-between mt-4">
            <div>
              <label class="inline-flex items-center">
                <input type="checkbox"
                  class="text-indigo-600 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
                <span class="mx-2 text-sm text-gray-600">Remember me</span>
              </label>
            </div>
          </div>
          <div class="mt-6">
            <button type="submit"
              class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500">
              <spinner v-if="loading" />
              <span v-else>Entrar</span>
            </button>
          </div>        
        </Form>
      </div>
    </div>
  </div>


</template>

<style scoped>
.area-login {
  margin-top: -60px;
}
@media (max-width: 768px) {
  .area-login {
  margin-top: -30px;
}}
</style>
