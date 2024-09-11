import imageCompression from 'browser-image-compression';
import { http } from '../api';

const controller = 'property/upload';

export async function importImage(file: File, type?: 'image' | 'user-image') {
  try {
    // Opções para compressão e conversão para WebP
    const options = {
      maxSizeMB: 1, // Tamanho máximo da imagem em MB
      maxWidthOrHeight: 1024, // Redimensiona a imagem para ter no máximo 1024px de largura ou altura
      useWebWorker: true, // Usa web worker para compressão
      fileType: 'image/webp', // Converte para WebP para melhor compressão e qualidade
    };

    // Comprime e converte a imagem para WebP
    const compressedFile = await imageCompression(file, options);

    // Cria um FormData para envio
    const form = new FormData();
    form.append('file', compressedFile);

    // Envia a imagem comprimida para a API
    return http.post(`${controller}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Erro ao comprimir e enviar a imagem:', error);
    throw error; // Relança o erro para ser tratado na chamada
  }
}
