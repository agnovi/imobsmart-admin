import { useToast } from "vue-toastification"
import * as XLSX from 'xlsx';
import { ColumnImport } from "@/types/import";

const toast = useToast()

let rows = [] as any;
let columnsFile = [] as any;

export const validateFile = (file: File, columns: ColumnImport[]) => {
  rows = []
  columnsFile = []

  return new Promise((resolve) => {
    const allowedExtensions = /(\.xls|\.csv|\.xlsx)$/i
    if (!allowedExtensions.exec(file.name)) {
      toast.error('Formato de arquivo inválido. Por favor, envie um arquivo xls, csv ou xlsx.')
      resolve(false)
    }

    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (e) => {
      const contents = e.target?.result as ArrayBuffer
      const workbook = XLSX.read(new Uint8Array(contents), { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const lines = XLSX.utils.sheet_to_csv(sheet).split('\n').filter(line => !/^,+$/g.test(line)).map(line => {
        const cleanedLine = line.replace(/"R\$ (\d+),(\d+)"/g, '$1$2').replace(/"/g, '').replace(/R\$/g, '');
        return cleanedLine;
      });
      const header = lines[0].split(',')

      if (lines.length === 1) {
        toast.error('Arquivo vazio. Por favor, preencha o arquivo e tente novamente.')
        resolve(false)
      }

     
     
      
      // if (header.length !== columns.length) {
      //   toast.error('Número de colunas inválido. Verifique o arquivo e tente novamente.')
      //   resolve(false)
      // }

      // const expectedHeader = columns.map(col => col.label)

      // if (!header.every((col: any, index: number) => col.trim() === expectedHeader[index])) {
      //   toast.error('Cabeçalho inválido. Verifique o arquivo e tente novamente.')
      //   resolve(false)
      // }

      // for (let i = 1; i < lines.length; i++) {
      //   const lineObject = {} as any;
      //   const data = lines[i].split(',')
      //   for (let j = 0; j < data.length; j++) {
      //     const column = columns[j];
      //     const columnName = column.label.toLocaleLowerCase();
      //     const value = data[j].trim();
      //     lineObject[columnName] = value;
      //   }
      //   rows.push(lineObject)
      // }


      // const error_messages = []

      // for (let i = 1; i < lines.length; i++) {
      //   const data = lines[i].split(',')
      //   for (let j = 0; j < data.length; j++) {
      //     const column = columns[j]
      //     const columnType = column.type
      //     const value = data[j].trim()

      //     if (column.required && value === '') {
      //       error_messages.push(`Campo ${column.label} é obrigatório.`)
      //       rows[i - 1].error = true
      //       resolve('error')
      //     }

      //     if (columnType === 'string' && typeof value !== 'string') {
      //       error_messages.push(`Tipo de dado inválido. Verifique o arquivo e tente novamente.`)
      //       resolve(false)
      //     }

      //     if (columnType === 'number' && isNaN(Number(value))) {
      //       error_messages.push(`Tipo de dado inválido. Verifique o arquivo e tente novamente.`)
      //       resolve(false)
      //     }
      //   }

      //   if (error_messages.length > 0) {
      //     error_messages.forEach(msg => toast.error(msg))
      //     resolve(false)
      //   }


      // }

      // columnsFile.push(
      //   ...columns.map(col => ({
      //     label: col.label,
      //     key: col.label.toLocaleLowerCase(),
      //     sort: 'desc',
      //     required: col.required,
      //   }))
      // )

      resolve(true)
    }
  })
}

export const getRowsAndColumns = () => {
  return { rows, columnsFile }
}