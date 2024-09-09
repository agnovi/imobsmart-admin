import { http } from '../api'

const controller = 'importLog'

export function getById(id: number) {
  return http.get(`${controller}/${id}`)
}

export function getAllById(data: any) {
  const typeQuery = data.type ? `&type=${data.type}` : ''
  return http.get(`${controller}?page=${data.page}&limit=${data.limit}${typeQuery}${(data.where ? `&where=${JSON.stringify(data.where)}` : "")}`)
  // return http.get(`${controller}?userId=${data.user_id}`)
}
