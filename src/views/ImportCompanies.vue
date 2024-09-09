<script setup lang="ts">
import { ref } from 'vue'
import Upload from '../components/Upload.vue';
import { ColumnImport } from '../types/import';
import { useToast } from 'vue-toastification';
import * as importService from '../api/services/ImportService';
import * as companyService from '../api/services/PropertyService';
import  useAuth from '../composables/useSession';

const toast = useToast()
const { userState } = useAuth()


const columnsFile = ref<ColumnImport[]>([
  { label: 'Nome', type: 'string', required: true},
  { label: 'CNPJ', type: 'string'},
]);

const columns = ref<any[]>([
  { key: 'name', label: 'CPF', sort: 'desc' },
  { key: 'cnpj', label: 'CNPJ', sort: 'desc' },
]);

const handleFileUpload = async (formData: File) => {
  const res = await importService.importCompanies(formData, String(userState.value.id))
    if(res.status === 201) {
      toast.info('Imóveis enviadas para fila de importação com sucesso!')
    }
}

const handleTemplateDownload = async () => {
  try {
    const response = await companyService.downloadModel()

    const blob = new Blob([response.data]);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'importar-empresas-template.xlsx');
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
    <Upload 
      title="Importar empresas"
      upload-text="Para importar, faça upload do seu arquivo xls, csv ou xlsx abaixo"
     :columns="columns"
     :columns-file="columnsFile" 
     @file-uploaded="handleFileUpload" 
     @download-template="handleTemplateDownload" 
    />
  </div>
</template>
