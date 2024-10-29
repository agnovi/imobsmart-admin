<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification';
import session from '@/composables/useSession'
import * as authService from '@/api/services/AuthService'
import Eye from '@/components/icones/Eye.vue'
import EyeX from '@/components/icones/Eye-x.vue'
const router = useRouter()
const useSession = session()
const toast = useToast()
const loading = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const confirm = ref('')
const password = ref('')
async function handleSubmit() {
  try {
    loading.value = true
    await authService.registerPassword({password: password.value})
    await useSession.login({ email: useSession.userState.value.email , password: password.value })

    toast.success("Senha alterada com sucesso")
    
    router.push('/dashboard')
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
        <h1 class="text-center mt-4 text-[#4F46E5] font-700 text-[24px]">Cadastro de Senha</h1>
        <Form @submit="handleSubmit" class="mt-4">
          <base-input v-model="password" :type="showPassword ? 'text' : 'password'" name="Senha" label="Senha" rules="required|passwordSeguro">
            <template #preppend>
        <button type="button" @click=" showPassword = !showPassword">
          <EyeX v-if="showPassword"/>
          <Eye v-else />
          </button
      ></template>
          </base-input>
          <base-input v-model="confirm" :type="showPasswordConfirm ? 'text' : 'password'" label="Confirmar Senha" rules="required|password:@Senha">
            <template #preppend>
        <button type="button" @click=" showPasswordConfirm = !showPasswordConfirm">
          <EyeX v-if="showPasswordConfirm"/>
          <Eye v-else />
          </button
      ></template>
          </base-input>
          <div class="mt-6">
            <button type="submit"
              class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500">
              <spinner v-if="loading" />
              <span v-else>Cadastrar Senha</span>
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
  }
}
</style>
