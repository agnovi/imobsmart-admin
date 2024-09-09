import { s3Client, PutObjectCommand } from '@/config/aws'
const { VITE_APP_BUCKET_S3 } = import.meta.env

const base64ToBlob = (base64Data: any, contentType = 'image/jpeg') => {
  try {
    const base64Content = base64Data.split(',')[1]
    if (!base64Content) {
      throw new Error('Base64 data não encontrada.')
    }
    const byteCharacters = atob(base64Content)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: contentType })
  } catch (error) {
    return null
  }
}

export const uploadImage = async (file: any) => {
  const base64Image = file

  if (typeof base64Image === 'string') {
    const blob = base64ToBlob(base64Image)

    if (blob) {
      const params = {
        Bucket: VITE_APP_BUCKET_S3,
        Key: file.name,
        Body: blob
      }
      try {
        const data = await s3Client.send(new PutObjectCommand(params))
        return {
          status: data.$metadata.httpStatusCode,
          message: 'Upload com sucesso',
          url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}` // URL do arquivo, ajuste conforme sua região se necessário
        }
      } catch (error) {
        return {
          status: 400,
          message: `Erro ao fazer upload: ${error}`
        }
      }
    } else {
      return {
        status: 400,
        message: `Imagem base64 inválida ou formato incorreto.`
      }
    }
  } else {
    return {
      status: 400,
      message: `Entrada base64 não é uma string válida.`
    }
  }
}
