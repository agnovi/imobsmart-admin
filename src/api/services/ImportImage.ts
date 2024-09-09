import { http } from '../api'

const controller = 'images'

export function importImage(file: any, type: 'image' | 'user-image') {
  const form = new FormData()
  form.append('file', file)
  return http.post(`${controller}?type=${type}`, form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
