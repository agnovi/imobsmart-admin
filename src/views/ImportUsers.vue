<script setup lang="ts">
import { ref } from 'vue'
import Upload from '../components/Upload.vue';
import { ColumnImport } from '../types/import';
import { useToast } from 'vue-toastification';
import useAuth from '../composables/useSession';
import * as importService from '../api/services/ImportService';
import * as userService from '../api/services/User';

const toast = useToast()
const { userState } = useAuth()


const columnsFile = ref<ColumnImport[]>([
  { label: 'Nome', type: 'string', required: true },
  { label: 'Email', type: 'string', required: true },
  { label: 'CPF', type: 'string', required: true },
  { label: 'CNPJ', type: 'string', required: true },
  { label: 'Cargo', type: 'string' },
  { label: 'Cluster', type: 'string' },
  { label: 'Grupo', type: 'string' },
  { label: 'Regional', type: 'string' },
  { label: 'Gestor', type: 'string' }
]);


const columns = ref<any[]>([
  { key: 'name', label: 'CPF', sort: 'desc' },
  { key: 'email', label: 'E-mail', sort: 'desc' },
  { key: 'cpf', label: 'CPF', sort: 'desc' },
  { key: 'cnpj', label: 'CNPJ', sort: 'desc' },
  { key: 'role', label: 'Cargo', sort: 'desc' },
  { key: 'cluster', label: 'Cluster', sort: 'desc' },
  { key: 'group', label: 'Grupo', sort: 'desc' },
  { key: 'regional', label: 'Regional', sort: 'desc' },
  { key: 'gestor', label: 'Gestor', sort: 'desc' }
]);

const handleFileUpload = async (formData: File) => {
  const res = await importService.importUsers(formData, String(userState.value?.id))
  if (res.status === 201) {
    toast.info('Usuários enviados para fila de importação com sucesso!')
  }
}

const handleTemplateDownload = async () => {
  try {
    const response = await userService.downloadModel()

    const blob = new Blob([response.data]);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'importar-usuarios-template.xlsx');
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    toast.error('Erro ao fazer o download do modelo')
  }
}


</script>

<template>
  <div>
    <Upload title="Importar usuários" upload-text="Para importar, faça upload do seu arquivo xls, csv ou xlsx abaixo"
      :columns="columns" :columns-file="columnsFile" @file-uploaded="handleFileUpload"
      @download-template="handleTemplateDownload" />
  </div>
</template>
