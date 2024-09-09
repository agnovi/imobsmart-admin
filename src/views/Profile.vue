<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CardForm from '../components/CardForm.vue';
import { useRouter } from 'vue-router';
import { getUser, editUser } from '@/api/services/AdminService';
import { UserProfile } from '@/types/user';
import { useToast } from 'vue-toastification';
import useAuth from '@/composables/useSession'
import { validarCNPJ } from '@/util/helpers';
import { validaCpfCnpj } from '@/util/helpers';

const toast = useToast()
const router = useRouter();
const { userState } = useAuth();
const user = ref<UserProfile>({});

const pixOptions = [
  { value: 'PHONE', text: 'Telefone' },
  { value: 'RANDOM', text: 'Chave aleatória' },
  { value: 'CPF', text: 'CPF' },
  { value: 'CNPJ', text: 'CNPJ' },
  { value: 'EMAIL', text: 'E-mail' },
];

async function loadUser() {
  await getUser(userState.value.id, { associations :true, campaigns: true}).then(({ data }: any) => {
    console.log('data');
    console.log(data);
    user.value = data;
    user.value.pixType = pixOptions.find((p: any) => p.value === data.pixType);

  })
}

function Salvar(user: UserProfile) {
  if(user.pixType?.value === 'CNPJ' && user.pixKey && !validarCNPJ(user.pixKey)) {
    toast.error('CNPJ inválido');
    return;
  }
  if(user.pixType?.value === 'CPF' && user.pixKey && !validaCpfCnpj(user.pixKey)) {
    toast.error('CPF inválido');
    return;
  }

  let userMaped = JSON.parse(JSON.stringify(user));
  
  editUser(userMaped).then((f: any) => {
    loadUser();
    toast.success('Usuario editado com sucesso!');
  });
  

}

function handleBack() {
  router.go(-1)
}


onMounted(() => {
  loadUser()
})
</script>
<template>
  <div>
    <div class="flex justify-between">
      <h3 class="text-3xl font-medium text-gray-700">Editar perfil</h3>
      <button class="border border-gray-600 rounded px-2 text-md" @click="handleBack">Voltar</button>
    </div>
    <CardForm>
      <template #content>
        <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1">
          <div>
            <from class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-3">
              <base-input v-model="user.name" type="text" label="Nome Completo" rules="required" />
              <base-input v-model="user.email" type="email" label="E-mail" rules="required" />
              <base-input v-model="user.phone" type="text" label="Telefone" mask="(##) #####-####" />
            </from>
          </div>
        </div>
        <div>
          <button class="btn-saved mt-20" @click="Salvar(user)">
            Salvar Alterações
          </button>
        </div>
      </template>
    </CardForm>
  </div>
</template>
<style scoped>
.btn-primary {
  background-color: #4F46E5;
  color: #FFFFFF;
  font-size: 14px;
  padding: 8px;
  gap: 10px;
  width: Hug (156px);
  height: Hug (36px);
  border-radius: 6px;
}

.btn-saved {
  background-color: #4F46E5;
  color: #FFFFFF;
  font-size: 14px;
  padding: 16px 50px 16px 50px;
  gap: 10px;
  width: Hug (156px);
  height: Hug (36px);
  border-radius: 6px;
}

.btn-primary:hover {
  background-color: #3630A8;
}

.btn-import {
  background-color: #F9FAFB;
  color: #354052;
  font-size: 14px;
  padding: 8px;
  gap: 10px;
  width: Hug (156px);
  height: Hug (36px);
  border-radius: 6px;
}

.btn-import:hover {
  background-color: #CFCFCF;
}
</style>